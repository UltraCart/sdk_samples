<?php
/*
 * delayAutoOrderItem.php
 *
 * Delay one item's next shipment in an auto-order by N days.
 *
 * Fetch with expansion, mutate, persist. UltraCart does not support PATCH.
 *
 * This is the canonical pattern for editing an auto-order item in UltraCart:
 *
 *   1. GET the auto-order with the `items` expansion.
 *   2. Mutate the target item IN PLACE on the object returned by GET.
 *   3. PUT the full auto-order back.
 *   4. Re-GET and verify the change actually persisted.
 *
 * UltraCart does NOT support PATCH on auto-orders. Sending a stripped-down
 * item object on PUT is unsafe -- fields you omit (frequency, paused,
 * arbitrary_*, options, etc.) can be lost, and updates to items in unusual
 * states (e.g. mid free-trial) may silently no-op. Always echo the full
 * item objects as returned by GET, then mutate only the field(s) you intend
 * to change.
 *
 * Typical use case: a support bot or AI agent processing
 *     "please delay my next shipment by 30 days"
 * for a specific item in a multi-item auto-order.
 */

ini_set('display_errors', 1);

require_once '../vendor/autoload.php';
require_once '../samples.php';

// Sample values. In a real integration these would come from the customer
// support request or AI agent context.
const REFERENCE_ORDER_ID = 'DEMO-0009103116'; // UltraCart order id that placed the auto-order
const ITEM_ID            = 'ITEM001';         // the original_item_id you want to delay
const DELAY_DAYS         = 30;

// DO_WORK defaults to false (dry run). Flip to true to actually persist.
const DO_WORK = false;

// How many days before the new shipment date to set the preshipment notice.
const PRESHIPMENT_NOTICE_LEAD_DAYS = 3;


$auto_order_api = Samples::getAutoOrderApi();
$expand = 'items';

// 1. Fetch the full auto-order with items expansion. We need every field on
//    every item so we can PUT them back unchanged.
//
//    Alternative lookup: if you have the auto_order_code instead of the
//    reference order id, use:
//        $auto_order_api->getAutoOrderByCode($auto_order_code, $expand);
$response = $auto_order_api->getAutoOrderByReferenceOrderId(REFERENCE_ORDER_ID, $expand);
if ($response->getError() !== null) {
    fail('getAutoOrderByReferenceOrderId', $response->getError());
}
$auto_order = $response->getAutoOrder();
if ($auto_order === null) {
    fwrite(STDERR, "ERROR: No auto-order found for reference order " . REFERENCE_ORDER_ID . ".\n");
    exit(1);
}

$target = findItem($auto_order, ITEM_ID);
if ($target === null) {
    fwrite(STDERR, "ERROR: Item " . ITEM_ID . " not found in auto-order for " . REFERENCE_ORDER_ID . ".\n");
    exit(1);
}

$current_dts_str = $target->getNextShipmentDts();
if ($current_dts_str === null || $current_dts_str === '') {
    fwrite(STDERR, "ERROR: Item " . ITEM_ID . " has no next_shipment_dts; nothing to delay.\n");
    exit(1);
}

$current_dts = new DateTime($current_dts_str);
$now         = new DateTime('now', $current_dts->getTimezone());

// 2. Compute the new dates. If the stored next_shipment_dts is in the past
//    (which can happen for items mid-cycle or post-trial), anchoring the
//    delay to that stale date would leave the customer with a near-term
//    shipment, not the delay they asked for. Anchor to whichever is later:
//    the stored date, or now.
$anchor = $current_dts > $now ? clone $current_dts : clone $now;
$new_shipment_dts = (clone $anchor)->modify('+' . DELAY_DAYS . ' days');
$new_notice_dts   = (clone $new_shipment_dts)->modify('-' . PRESHIPMENT_NOTICE_LEAD_DAYS . ' days');

if ($new_notice_dts <= $now) {
    fwrite(STDERR, "ERROR: Computed preshipment notice " . isofmt($new_notice_dts) . " is not in the future.\n");
    exit(1);
}

// 3. Mutate the target item IN PLACE. Do not rebuild the items array.
//    Every other field on the item (and every other item in the auto-order)
//    is preserved exactly as UltraCart returned it.
$new_shipment_iso = isofmt($new_shipment_dts);
$new_notice_iso   = isofmt($new_notice_dts);
$target->setNextShipmentDts($new_shipment_iso);
$target->setNextPreshipmentNoticeDts($new_notice_iso);

echo str_repeat('-', 60) . "\n";
echo "Reference order:      " . REFERENCE_ORDER_ID . "\n";
echo "Item:                 " . ITEM_ID . "\n";
echo "Current next ship:    {$current_dts_str}\n";
echo "Proposed next ship:   {$new_shipment_iso}\n";
echo "Proposed notice:      {$new_notice_iso}\n";
if ($current_dts < $now) {
    echo "Note: stored next_shipment_dts was in the past; anchored delay to today.\n";
}
echo str_repeat('-', 60) . "\n";

if (!DO_WORK) {
    echo "DRY RUN -- no changes persisted. Set DO_WORK = true to apply.\n";
    exit(0);
}

// 4. PUT the full auto-order back.
//    The PHP SDK's updateAutoOrder takes (oid, auto_order, validate_original_order, _expand).
//    "No" skips re-validation of the original order; an item-level date edit doesn't need it.
$put_response = $auto_order_api->updateAutoOrder(
    $auto_order->getAutoOrderOid(), $auto_order, 'No', $expand);
if ($put_response->getError() !== null) {
    fail('updateAutoOrder', $put_response->getError());
}
$put_item = findItem($put_response->getAutoOrder(), ITEM_ID);
echo "PUT response next_shipment_dts: " . ($put_item !== null ? $put_item->getNextShipmentDts() : '(item not in response)') . "\n";

// 5. Re-GET and verify the change actually persisted. UltraCart can echo a
//    value back in the PUT response without it sticking for items in
//    unusual states. A fresh GET is the only way to know for sure.
$verify_response = $auto_order_api->getAutoOrderByReferenceOrderId(REFERENCE_ORDER_ID, $expand);
if ($verify_response->getError() !== null) {
    fail('getAutoOrderByReferenceOrderId (verify)', $verify_response->getError());
}
$verify_item = findItem($verify_response->getAutoOrder(), ITEM_ID);
$verified_dts_str = $verify_item !== null ? $verify_item->getNextShipmentDts() : null;

if ($verified_dts_str !== null
    && (new DateTime($verified_dts_str)) == $new_shipment_dts) {
    echo "VERIFIED: next_shipment_dts persisted as {$verified_dts_str}\n";
    exit(0);
}

echo "WARNING: Re-GET shows next_shipment_dts = " . ($verified_dts_str ?? '(null)')
   . ", expected {$new_shipment_iso}.\n";
echo "The PUT was accepted by UltraCart but the value did not stick on re-read.\n";
echo "This commonly indicates the item is in a state UltraCart manages "
   . "automatically (e.g. mid free-trial). Escalate for human review.\n";
exit(2);


// =====================================================================
// Helpers
// =====================================================================

function findItem($auto_order, string $item_id) {
    if ($auto_order === null) return null;
    foreach ($auto_order->getItems() ?? [] as $item) {
        if ($item->getOriginalItemId() === $item_id) {
            return $item;
        }
    }
    return null;
}

function isofmt(DateTime $dt): string {
    // Matches Python's astimezone().isoformat('T', 'milliseconds'):
    //   yyyy-MM-ddTHH:mm:ss.fff+HH:MM
    return $dt->format('Y-m-d\\TH:i:s.000P');
}

function fail(string $operation, $error): void {
    fwrite(STDERR, "ERROR in {$operation}:\n");
    fwrite(STDERR, "  Developer message: " . ($error->getDeveloperMessage() ?? '') . "\n");
    fwrite(STDERR, "  User message:      " . ($error->getUserMessage() ?? '') . "\n");
    exit(1);
}
