<?php

ini_set('display_errors', 1);

/*
 * Scenario: you have a list of automatic enrollment items and want customers to be able to change the frequency of
 * all of them from MyAccount.  This sets the same MyAccount frequency change settings on every item in the list.
 * See updateItemMyAccountFrequencyChange.php for what the three properties mean and the requirements.
 *
 * It runs as a dry run by default: it reads each item and prints what it would change, without saving anything.
 * Check the output, then set $dry_run = false.
 *
 * Expansion: each item is read with _expand=auto_order (NOT auto_order.steps) and the same auto_order object is sent
 * back with only the three MyAccount properties changed.  An update writes every auto order setting from the object
 * it is given, and replaces the steps if steps are present, so never send a hand-built or partial auto_order.
 *
 * Items are updated one at a time so each item gets its own result line.  updateItems() (items/batch) can do up to 20
 * per call, but it saves items in order and stops at the first one that fails, leaving the earlier ones saved.
 * If you get a 429 (too many requests), slow down and rerun; items already set are reported as unchanged.
 *
 * You can do the same thing without code with the Batch Item Update tool (the MyAccount Frequency Change option).
 */

use ultracart\v2\api\ItemApi;
use ultracart\v2\ApiException;
use ultracart\v2\models\ItemAutoOrder;

require_once '../vendor/autoload.php';
require_once '../constants.php';

$dry_run = true; // change_me: false to save

// change_me: the automatic enrollment items to update
$merchant_item_ids = ['AUTOSHIP-30', 'AUTOSHIP-60', 'AUTOSHIP-90'];

// change_me: what customers may switch to.  Empty arrays turn the change off for these items.
$schedules = ['Monthly', 'Every 2 Months', 'Every 3 Months'];
$day_counts = [30, 60, 90];
$last_step_only = false;

$expand = 'auto_order'; // NOT auto_order.steps

// Sorted so the comparison doesn't depend on order.  Day counts that match a standard schedule (10, 24, 28, 45)
// come back as that schedule, so such an item reports "changed" on every run; list those as schedules instead.
function describe(?ItemAutoOrder $auto_order): string
{
    if ($auto_order == null) {
        return 'off';
    }
    $item_schedules = $auto_order->getAutoOrderMyaccountFrequencySchedules() ?? [];
    $item_day_counts = $auto_order->getAutoOrderMyaccountFrequencyDayCounts() ?? [];
    sort($item_schedules);
    sort($item_day_counts, SORT_NUMERIC);
    if (empty($item_schedules) && empty($item_day_counts)) {
        return 'off';
    }
    $suffix = $auto_order->getAutoOrderMyaccountFrequencyLastStepOnly() ? ', last step only' : '';
    return '[' . implode(', ', $item_schedules) . '] days [' . implode(', ', $item_day_counts) . ']' . $suffix;
}

$item_api = ItemApi::usingApiKey(Constants::API_KEY);
$updated = $unchanged = $skipped = $failed = 0;

echo '<html lang="en"><body><pre>';

foreach ($merchant_item_ids as $merchant_item_id) {
    try {
        $item_response = $item_api->getItemByMerchantItemId($merchant_item_id, $expand, false);
        $item = $item_response->getItem();
        if ($item == null) {
            echo "$merchant_item_id: not found, skipped\n";
            $skipped++;
            continue;
        }

        $auto_order = $item->getAutoOrder();
        if ($auto_order == null || !$auto_order->getAutoOrderUpsell()) {
            echo "$merchant_item_id: does not use automatic enrollment, skipped\n";
            $skipped++;
            continue;
        }

        $before = describe($auto_order);
        $auto_order->setAutoOrderMyaccountFrequencySchedules($schedules);
        $auto_order->setAutoOrderMyaccountFrequencyDayCounts($day_counts);
        $auto_order->setAutoOrderMyaccountFrequencyLastStepOnly($last_step_only);
        $after = describe($auto_order);

        if ($before === $after) {
            echo "$merchant_item_id: already $after, unchanged\n";
            $unchanged++;
            continue;
        }

        if ($dry_run) {
            echo "$merchant_item_id: would change $before -> $after\n";
            $updated++;
            continue;
        }

        $update_response = $item_api->updateItem($item->getMerchantItemOid(), $item, $expand, false);
        echo "$merchant_item_id: changed $before -> " . describe($update_response->getItem()->getAutoOrder()) . "\n";
        $updated++;

    } catch (ApiException $e) {
        // A 400 explains itself: feature not enabled on the account, unknown schedule name, or a bad day count.
        echo "$merchant_item_id: FAILED " . $e->getCode() . ' ' . print_r($e->getResponseBody(), true) . "\n";
        $failed++;
    }
}

echo ($dry_run ? 'Dry run. Would update' : 'Updated') . ": $updated, unchanged: $unchanged, skipped: $skipped, failed: $failed\n";
echo '</pre></body></html>';
