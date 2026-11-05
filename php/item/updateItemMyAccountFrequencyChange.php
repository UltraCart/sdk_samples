<?php

ini_set('display_errors', 1);

/*
 * Scenario: an item uses automatic enrollment (the customer is put on a fixed auto order schedule at checkout and does
 * not pick a frequency).  You want customers to be able to change the frequency of that item from MyAccount, for
 * example to Monthly, Every 2 Months, or every 30, 60 or 90 days.
 *
 * Three properties on item.auto_order control this:
 *   auto_order_myaccount_frequency_schedules       standard schedule names, e.g. "Monthly", "Every 2 Months"
 *   auto_order_myaccount_frequency_day_counts      day counts, 1 to 365, at most 20, e.g. [30, 60, 90].  10, 24, 28 and
 *                                                  45 are saved as the standard schedules "Every 10 Days" and so on.
 *   auto_order_myaccount_frequency_last_step_only  only offer the change once the item is on its last auto order step
 * Omit a property to leave it unchanged.  Send an empty array to clear it.  Empty schedules and day counts turn the
 * MyAccount frequency change off for the item.
 *
 * Requirements:
 * - UltraCart support must enable "MyAccount - Advanced Auto Order Settings" on your account.  Without it, setting
 *   these properties returns a 400.
 * - The item must use automatic enrollment (auto_order.auto_order_upsell = true).  Otherwise a 400.
 * - The change is only offered to a customer when the item's auto order steps repeat forever.  An item whose steps end
 *   (for example "Monthly x5, then stop") never offers it, whatever is set here.  UltraCart checks this when the
 *   customer asks, not when you save the item.
 *
 * Expansion matters here:
 * - Read the item with _expand=auto_order.  That returns the whole auto order section, including these properties.
 * - Send that same auto_order object back.  When auto_order is present in an update, UltraCart writes every auto order
 *   setting from it, so a partial or hand-built auto_order object would reset settings you did not mean to touch.
 * - Do NOT add auto_order.steps to the expansion.  If steps are present in the update they replace the item's steps.
 *   Leaving them out leaves the steps alone.
 *
 * What the customer sees: the allowed frequencies are offered on the auto order item in MyAccount.  A change takes
 * effect after the next shipment; the next shipment date does not move.
 */

use ultracart\v2\api\ItemApi;
use ultracart\v2\ApiException;
use ultracart\v2\models\ItemAutoOrder;

require_once '../vendor/autoload.php';
require_once '../constants.php';

function printSettings(?ItemAutoOrder $auto_order)
{
    if ($auto_order == null) {
        echo "  (no auto order section)\n";
        return;
    }
    $schedules = $auto_order->getAutoOrderMyaccountFrequencySchedules();
    $day_counts = $auto_order->getAutoOrderMyaccountFrequencyDayCounts();
    echo '  Schedules: ' . (empty($schedules) ? '(none)' : implode(', ', $schedules)) . "\n";
    echo '  Day counts: ' . (empty($day_counts) ? '(none)' : implode(', ', $day_counts)) . "\n";
    echo '  Last step only: ' . ($auto_order->getAutoOrderMyaccountFrequencyLastStepOnly() ? 'true' : 'false') . "\n";
}

$item_api = ItemApi::usingApiKey(Constants::API_KEY);

$merchant_item_id = 'AUTOSHIP-30'; // change_me: an item that uses automatic enrollment
$expand = 'auto_order';            // NOT auto_order.steps, see above

echo '<html lang="en"><body><pre>';

try {
    // Step 1. Read the item with its auto order section.
    $item_response = $item_api->getItemByMerchantItemId($merchant_item_id, $expand, false);
    $item = $item_response->getItem();
    $auto_order = $item->getAutoOrder();

    // Step 2. Make sure the item uses automatic enrollment.
    if ($auto_order == null || !$auto_order->getAutoOrderUpsell()) {
        echo "Item $merchant_item_id does not use automatic enrollment.  Nothing to do.\n";
        exit();
    }

    echo "Before:\n";
    printSettings($auto_order);

    // Step 3. Set the frequencies a customer may switch to.  Everything else in auto_order is sent back as read.
    $auto_order->setAutoOrderMyaccountFrequencySchedules(['Monthly', 'Every 2 Months', 'Every 3 Months']);
    $auto_order->setAutoOrderMyaccountFrequencyDayCounts([30, 60, 90]);
    $auto_order->setAutoOrderMyaccountFrequencyLastStepOnly(false);

    // To turn the change off for this item instead:
    // $auto_order->setAutoOrderMyaccountFrequencySchedules([]);
    // $auto_order->setAutoOrderMyaccountFrequencyDayCounts([]);

    // Step 4. Save.  The same expansion returns the saved auto order section.
    $update_response = $item_api->updateItem($item->getMerchantItemOid(), $item, $expand, false);

    echo "After:\n";
    printSettings($update_response->getItem()->getAutoOrder());

} catch (ApiException $e) {
    // A 400 explains itself: feature not enabled on the account, item not automatic enrollment,
    // unknown schedule name, or a bad day count.
    echo 'An ApiException occurred.  Please review the following error:';
    var_dump($e->getResponseBody()); // <-- change_me: handle gracefully
}

echo '</pre></body></html>';
