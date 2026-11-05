import {itemApi} from '../api.js';

/*
 * Scenario: an item uses automatic enrollment (the customer is put on a fixed auto order schedule at checkout and does
 * not pick a frequency).  You want customers to be able to change the frequency of that item from MyAccount, for
 * example to Monthly, Every 2 Months, or every 30, 60 or 90 days.
 *
 * Three properties on item.auto_order control this:
 *   auto_order_myaccount_frequency_schedules     standard schedule names, e.g. "Monthly", "Every 2 Months"
 *   auto_order_myaccount_frequency_day_counts    day counts, 1 to 365, at most 20, e.g. [30, 60, 90].  10, 24, 28 and
 *                                                45 are saved as the standard schedules "Every 10 Days" and so on.
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
export class UpdateItemMyAccountFrequencyChange {
    static async execute() {
        const merchantItemId = "AUTOSHIP-30";  // change_me: an item that uses automatic enrollment
        const expand = "auto_order";           // NOT auto_order.steps, see above

        try {
            // Step 1. Read the item with its auto order section.
            const itemResponse = await new Promise((resolve, reject) => {
                itemApi.getItemByMerchantItemId(merchantItemId, {_expand: expand, _placeholders: false}, function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            if (itemResponse.error) {
                console.error('Developer Message:', itemResponse.error.developer_message);
                console.error('User Message:', itemResponse.error.user_message);
                return;
            }
            const item = itemResponse.item;
            const autoOrder = item.auto_order;

            // Step 2. Make sure the item uses automatic enrollment.
            if (!autoOrder || !autoOrder.auto_order_upsell) {
                console.log(`Item ${merchantItemId} does not use automatic enrollment.  Nothing to do.`);
                return;
            }

            console.log('Before:');
            UpdateItemMyAccountFrequencyChange.print(autoOrder);

            // Step 3. Set the frequencies a customer may switch to.  Everything else in auto_order is sent back as read.
            autoOrder.auto_order_myaccount_frequency_schedules = ["Monthly", "Every 2 Months", "Every 3 Months"];
            autoOrder.auto_order_myaccount_frequency_day_counts = [30, 60, 90];
            autoOrder.auto_order_myaccount_frequency_last_step_only = false;

            // To turn the change off for this item instead:
            // autoOrder.auto_order_myaccount_frequency_schedules = [];
            // autoOrder.auto_order_myaccount_frequency_day_counts = [];

            // Step 4. Save.  The same expansion returns the saved auto order section.
            const updateResponse = await new Promise((resolve, reject) => {
                itemApi.updateItem(item.merchant_item_oid, item, {_expand: expand, _placeholders: false}, function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            if (updateResponse.error) {
                console.error('Developer Message:', updateResponse.error.developer_message);
                console.error('User Message:', updateResponse.error.user_message);
                return;
            }

            console.log('After:');
            UpdateItemMyAccountFrequencyChange.print(updateResponse.item && updateResponse.item.auto_order);
        } catch (error) {
            // A 400 explains itself: feature not enabled on the account, item not automatic enrollment,
            // unknown schedule name, or a bad day count.
            console.error('Error updating the MyAccount frequency change:', error);
        }
    }

    static print(autoOrder) {
        console.log(`  Schedules: ${(autoOrder && autoOrder.auto_order_myaccount_frequency_schedules) || '(none)'}`);
        console.log(`  Day counts: ${(autoOrder && autoOrder.auto_order_myaccount_frequency_day_counts) || '(none)'}`);
        console.log(`  Last step only: ${(autoOrder && autoOrder.auto_order_myaccount_frequency_last_step_only) || false}`);
    }
}
