import { autoOrderApi } from '../api.js';

/**
 * delayAutoOrderItem
 *
 * Delays one item's next shipment in an auto-order by N days.
 *
 * Fetch with expansion, mutate, persist. UltraCart does not support PATCH.
 *
 * This is the canonical pattern for editing an auto-order item in UltraCart:
 *
 *   1. GET the auto-order with the items expansion.
 *   2. Mutate the target item IN PLACE on the object returned by GET.
 *   3. PUT the full auto-order back.
 *   4. Re-GET and verify the change actually persisted.
 *
 * Sending a stripped-down item object on PUT is unsafe -- fields you omit
 * (frequency, paused, arbitrary_*, options, etc.) can be lost, and updates
 * to items in unusual states (e.g. mid free-trial) may silently no-op.
 * Always echo the full item objects as returned by GET, then mutate only
 * the field(s) you intend to change.
 *
 * Typical use case: a support bot or AI agent processing
 *     "please delay my next shipment by 30 days"
 * for a specific item in a multi-item auto-order.
 */

// Sample values. In a real integration these would come from the customer
// support request or AI agent context.
const REFERENCE_ORDER_ID = 'DEMO-0009103116'; // UltraCart order id that placed the auto-order
const ITEM_ID            = 'ITEM001';         // the original_item_id you want to delay
const DELAY_DAYS         = 30;

// DO_WORK defaults to false (dry run). Flip to true to actually persist.
const DO_WORK = false;

// How many days before the new shipment date to set the preshipment notice.
const PRESHIPMENT_NOTICE_LEAD_DAYS = 3;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export async function execute() {
    const expand = 'items';

    try {
        // 1. Fetch the full auto-order with items expansion. We need every
        //    field on every item so we can PUT them back unchanged.
        //
        //    Alternative lookup: if you have the auto_order_code instead of
        //    the reference order id, use autoOrderApi.getAutoOrderByCode.
        const getResponse = await new Promise((resolve, reject) => {
            autoOrderApi.getAutoOrderByReferenceOrderId(REFERENCE_ORDER_ID, { _expand: expand }, function (error, data) {
                if (error) reject(error);
                else resolve(data);
            });
        });

        const autoOrder = getResponse.auto_order;
        if (!autoOrder) {
            console.error('ERROR: No auto-order found for reference order ' + REFERENCE_ORDER_ID + '.');
            return;
        }

        const target = findItem(autoOrder, ITEM_ID);
        if (!target) {
            console.error('ERROR: Item ' + ITEM_ID + ' not found in auto-order for ' + REFERENCE_ORDER_ID + '.');
            return;
        }

        const currentDtsStr = target.next_shipment_dts;
        if (!currentDtsStr) {
            console.error('ERROR: Item ' + ITEM_ID + ' has no next_shipment_dts; nothing to delay.');
            return;
        }

        const currentDts = new Date(currentDtsStr);
        if (isNaN(currentDts.getTime())) {
            console.error('ERROR: Could not parse next_shipment_dts "' + currentDtsStr + '".');
            return;
        }
        const now = new Date();

        // 2. Compute the new dates. If the stored next_shipment_dts is in the
        //    past (which can happen for items mid-cycle or post-trial),
        //    anchoring the delay to that stale date would leave the customer
        //    with a near-term shipment, not the delay they asked for. Anchor
        //    to whichever is later: the stored date, or now.
        const anchor = currentDts.getTime() > now.getTime() ? currentDts : now;
        const newShipmentDts = new Date(anchor.getTime() + DELAY_DAYS * MS_PER_DAY);
        const newNoticeDts = new Date(newShipmentDts.getTime() - PRESHIPMENT_NOTICE_LEAD_DAYS * MS_PER_DAY);

        if (newNoticeDts.getTime() <= now.getTime()) {
            console.error('ERROR: Computed preshipment notice ' + isoFmt(newNoticeDts) + ' is not in the future.');
            return;
        }

        // 3. Mutate the target item IN PLACE. Do not rebuild the items array.
        //    Every other field on the item (and every other item in the
        //    auto-order) is preserved exactly as UltraCart returned it.
        const newShipmentIso = isoFmt(newShipmentDts);
        const newNoticeIso = isoFmt(newNoticeDts);
        target.next_shipment_dts = newShipmentIso;
        target.next_preshipment_notice_dts = newNoticeIso;

        console.log('-'.repeat(60));
        console.log('Reference order:      ' + REFERENCE_ORDER_ID);
        console.log('Item:                 ' + ITEM_ID);
        console.log('Current next ship:    ' + currentDtsStr);
        console.log('Proposed next ship:   ' + newShipmentIso);
        console.log('Proposed notice:      ' + newNoticeIso);
        if (currentDts.getTime() < now.getTime()) {
            console.log('Note: stored next_shipment_dts was in the past; anchored delay to today.');
        }
        console.log('-'.repeat(60));

        if (!DO_WORK) {
            console.log('DRY RUN -- no changes persisted. Set DO_WORK = true to apply.');
            return;
        }

        // 4. PUT the full auto-order back.
        const putResponse = await new Promise((resolve, reject) => {
            autoOrderApi.updateAutoOrder(
                autoOrder.auto_order_oid,
                autoOrder,
                { _expand: expand },
                function (error, data) {
                    if (error) reject(error);
                    else resolve(data);
                }
            );
        });

        const putItem = findItem(putResponse.auto_order, ITEM_ID);
        console.log('PUT response next_shipment_dts: ' + (putItem ? putItem.next_shipment_dts : '(item not in response)'));

        // 5. Re-GET and verify the change actually persisted. UltraCart can
        //    echo a value back in the PUT response without it sticking for
        //    items in unusual states. A fresh GET is the only way to know
        //    for sure.
        const verifyResponse = await new Promise((resolve, reject) => {
            autoOrderApi.getAutoOrderByReferenceOrderId(REFERENCE_ORDER_ID, { _expand: expand }, function (error, data) {
                if (error) reject(error);
                else resolve(data);
            });
        });

        const verifyItem = findItem(verifyResponse.auto_order, ITEM_ID);
        const verifiedDtsStr = verifyItem ? verifyItem.next_shipment_dts : null;

        if (verifiedDtsStr && new Date(verifiedDtsStr).getTime() === newShipmentDts.getTime()) {
            console.log('VERIFIED: next_shipment_dts persisted as ' + verifiedDtsStr);
            return;
        }

        console.warn('WARNING: Re-GET shows next_shipment_dts = ' + verifiedDtsStr + ', expected ' + newShipmentIso + '.');
        console.warn('The PUT was accepted by UltraCart but the value did not stick on re-read.');
        console.warn('This commonly indicates the item is in a state UltraCart manages '
            + 'automatically (e.g. mid free-trial). Escalate for human review.');
    } catch (error) {
        console.error('Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
        console.error(error instanceof Error ? error.stack : error);
    }
}

function findItem(autoOrder, itemId) {
    const items = (autoOrder && autoOrder.items) || [];
    for (const item of items) {
        if (item.original_item_id === itemId) {
            return item;
        }
    }
    return null;
}

/**
 * Format a Date as UltraCart-style ISO 8601 with milliseconds in local time
 * with a numeric timezone offset (e.g. 2026-06-18T09:15:00.000-04:00).
 *
 * Date#toISOString() always emits UTC with a trailing 'Z'; the Python
 * reference emits a local offset, which is what the API returns on GET.
 */
function isoFmt(dt) {
    const pad2 = (n) => String(n).padStart(2, '0');
    const pad3 = (n) => String(n).padStart(3, '0');

    const year    = dt.getFullYear();
    const month   = pad2(dt.getMonth() + 1);
    const day     = pad2(dt.getDate());
    const hours   = pad2(dt.getHours());
    const minutes = pad2(dt.getMinutes());
    const seconds = pad2(dt.getSeconds());
    const millis  = pad3(dt.getMilliseconds());

    const offsetMin = -dt.getTimezoneOffset();
    const sign      = offsetMin >= 0 ? '+' : '-';
    const offsetAbs = Math.abs(offsetMin);
    const offH      = pad2(Math.floor(offsetAbs / 60));
    const offM      = pad2(offsetAbs % 60);

    return year + '-' + month + '-' + day + 'T' + hours + ':' + minutes + ':' + seconds + '.' + millis + sign + offH + ':' + offM;
}

execute().catch(console.error);
