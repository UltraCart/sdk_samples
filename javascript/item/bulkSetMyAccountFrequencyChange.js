import {itemApi} from '../api.js';

/*
 * Scenario: you have a list of automatic enrollment items and want customers to be able to change the frequency of
 * all of them from MyAccount.  This sets the same MyAccount frequency change settings on every item in the list.
 * See updateItemMyAccountFrequencyChange.js for what the three properties mean and the requirements.
 *
 * It runs as a dry run by default: it reads each item and prints what it would change, without saving anything.
 * Check the output, then set dryRun = false.
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
export class BulkSetMyAccountFrequencyChange {
    static async execute() {
        const dryRun = true;  // change_me: false to save

        // change_me: the automatic enrollment items to update
        const merchantItemIds = ["AUTOSHIP-30", "AUTOSHIP-60", "AUTOSHIP-90"];

        // change_me: what customers may switch to.  Empty arrays turn the change off for these items.
        const schedules = ["Monthly", "Every 2 Months", "Every 3 Months"];
        const dayCounts = [30, 60, 90];
        const lastStepOnly = false;

        const expand = "auto_order";  // NOT auto_order.steps

        let updated = 0, unchanged = 0, skipped = 0, failed = 0;

        for (const merchantItemId of merchantItemIds) {
            try {
                const itemResponse = await new Promise((resolve, reject) => {
                    itemApi.getItemByMerchantItemId(merchantItemId, {_expand: expand, _placeholders: false}, function (error, data, response) {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(data);
                        }
                    });
                });
                const item = itemResponse.item;
                if (!item) {
                    console.log(`${merchantItemId}: not found, skipped`);
                    skipped++;
                    continue;
                }

                const autoOrder = item.auto_order;
                if (!autoOrder || !autoOrder.auto_order_upsell) {
                    console.log(`${merchantItemId}: does not use automatic enrollment, skipped`);
                    skipped++;
                    continue;
                }

                const before = BulkSetMyAccountFrequencyChange.describe(autoOrder);
                autoOrder.auto_order_myaccount_frequency_schedules = schedules;
                autoOrder.auto_order_myaccount_frequency_day_counts = dayCounts;
                autoOrder.auto_order_myaccount_frequency_last_step_only = lastStepOnly;
                const after = BulkSetMyAccountFrequencyChange.describe(autoOrder);

                if (before === after) {
                    console.log(`${merchantItemId}: already ${after}, unchanged`);
                    unchanged++;
                    continue;
                }

                if (dryRun) {
                    console.log(`${merchantItemId}: would change ${before} -> ${after}`);
                    updated++;
                    continue;
                }

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
                    console.log(`${merchantItemId}: FAILED ${updateResponse.error.developer_message}`);
                    failed++;
                    continue;
                }
                console.log(`${merchantItemId}: changed ${before} -> ${BulkSetMyAccountFrequencyChange.describe(updateResponse.item && updateResponse.item.auto_order)}`);
                updated++;
            } catch (error) {
                // A 400 explains itself: feature not enabled on the account, unknown schedule name, or a bad day count.
                console.log(`${merchantItemId}: FAILED`, error);
                failed++;
            }
        }

        console.log(`${dryRun ? 'Dry run. Would update' : 'Updated'}: ${updated}, unchanged: ${unchanged}, skipped: ${skipped}, failed: ${failed}`);
    }

    // Sorted so the comparison doesn't depend on order.  Day counts that match a standard schedule (10, 24, 28, 45)
    // come back as that schedule, so such an item reports "changed" on every run; list those as schedules instead.
    static describe(autoOrder) {
        const schedules = [...((autoOrder && autoOrder.auto_order_myaccount_frequency_schedules) || [])].sort();
        const dayCounts = [...((autoOrder && autoOrder.auto_order_myaccount_frequency_day_counts) || [])].sort((a, b) => a - b);
        if (schedules.length === 0 && dayCounts.length === 0) return 'off';
        const lastStepOnly = autoOrder && autoOrder.auto_order_myaccount_frequency_last_step_only ? ', last step only' : '';
        return `[${schedules.join(', ')}] days [${dayCounts.join(', ')}]${lastStepOnly}`;
    }
}
