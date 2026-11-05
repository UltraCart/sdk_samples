using System;
using System.Collections.Generic;
using System.Linq;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Client;
using com.ultracart.admin.v2.Model;

namespace SdkSample.item
{
    public class BulkSetMyAccountFrequencyChange
    {
        /*
         * Scenario: you have a list of automatic enrollment items and want customers to be able to change the frequency
         * of all of them from MyAccount.  This sets the same MyAccount frequency change settings on every item in the
         * list.  See UpdateItemMyAccountFrequencyChange for what the three properties mean, the requirements, and the
         * C# note about AutoOrderMyaccountFrequencyLastStepOnly.
         *
         * It runs as a dry run by default: it reads each item and prints what it would change, without saving
         * anything.  Check the output, then set dryRun = false.
         *
         * Expansion: each item is read with _expand=auto_order (NOT auto_order.steps) and the same AutoOrder object is
         * sent back with only the three MyAccount properties changed.  An update writes every auto order setting from the
         * object it is given, and replaces the steps if steps are present, so never send a hand-built or partial
         * AutoOrder.
         *
         * Items are updated one at a time so each item gets its own result line.  UpdateItems() (items/batch) can do up
         * to 20 per call, but it saves items in order and stops at the first one that fails, leaving the earlier ones
         * saved.  If you get a 429 (too many requests), slow down and rerun; items already set are reported as unchanged.
         *
         * You can do the same thing without code with the Batch Item Update tool (the MyAccount Frequency Change option).
         */
        public static void Execute()
        {
            bool dryRun = true; // change_me: false to save

            // change_me: the automatic enrollment items to update
            List<string> merchantItemIds = new List<string> { "AUTOSHIP-30", "AUTOSHIP-60", "AUTOSHIP-90" };

            // change_me: what customers may switch to.  Empty lists turn the change off for these items.
            List<string> schedules = new List<string> { "Monthly", "Every 2 Months", "Every 3 Months" };
            List<int> dayCounts = new List<int> { 30, 60, 90 };
            bool lastStepOnly = false;

            string expand = "auto_order"; // NOT auto_order.steps

            ItemApi itemApi = new ItemApi(Constants.ApiKey);
            int updated = 0, unchanged = 0, skipped = 0, failed = 0;

            foreach (string merchantItemId in merchantItemIds)
            {
                try
                {
                    ItemResponse itemResponse = itemApi.GetItemByMerchantItemId(merchantItemId, expand, false);
                    Item item = itemResponse.Item;
                    if (item == null)
                    {
                        Console.WriteLine($"{merchantItemId}: not found, skipped");
                        skipped++;
                        continue;
                    }

                    ItemAutoOrder autoOrder = item.AutoOrder;
                    if (autoOrder == null || !autoOrder.AutoOrderUpsell)
                    {
                        Console.WriteLine($"{merchantItemId}: does not use automatic enrollment, skipped");
                        skipped++;
                        continue;
                    }

                    string before = Describe(autoOrder);
                    autoOrder.AutoOrderMyaccountFrequencySchedules = new List<string>(schedules);
                    autoOrder.AutoOrderMyaccountFrequencyDayCounts = new List<int>(dayCounts);
                    autoOrder.AutoOrderMyaccountFrequencyLastStepOnly = lastStepOnly;
                    string after = Describe(autoOrder);

                    if (before == after)
                    {
                        Console.WriteLine($"{merchantItemId}: already {after}, unchanged");
                        unchanged++;
                        continue;
                    }

                    if (dryRun)
                    {
                        Console.WriteLine($"{merchantItemId}: would change {before} -> {after}");
                        updated++;
                        continue;
                    }

                    ItemResponse updateResponse = itemApi.UpdateItem(item.MerchantItemOid, item, expand, false);
                    if (updateResponse.Error != null)
                    {
                        Console.WriteLine($"{merchantItemId}: FAILED {updateResponse.Error.DeveloperMessage}");
                        failed++;
                        continue;
                    }
                    Console.WriteLine($"{merchantItemId}: changed {before} -> {Describe(updateResponse.Item.AutoOrder)}");
                    updated++;
                }
                catch (ApiException e)
                {
                    // A 400 explains itself: feature not enabled on the account, unknown schedule name, or a bad day count.
                    Console.WriteLine($"{merchantItemId}: FAILED {e.ErrorCode} {e.ErrorContent}");
                    failed++;
                }
            }

            Console.WriteLine($"{(dryRun ? "Dry run. Would update" : "Updated")}: {updated}, unchanged: {unchanged}, skipped: {skipped}, failed: {failed}");
        }

        // Sorted so the comparison doesn't depend on order.  Day counts that match a standard schedule (10, 24, 28, 45)
        // come back as that schedule, so such an item reports "changed" on every run; list those as schedules instead.
        private static string Describe(ItemAutoOrder autoOrder)
        {
            if (autoOrder == null) return "off";
            List<string> itemSchedules = (autoOrder.AutoOrderMyaccountFrequencySchedules ?? new List<string>()).OrderBy(s => s).ToList();
            List<int> itemDayCounts = (autoOrder.AutoOrderMyaccountFrequencyDayCounts ?? new List<int>()).OrderBy(d => d).ToList();
            if (itemSchedules.Count == 0 && itemDayCounts.Count == 0) return "off";
            string suffix = autoOrder.AutoOrderMyaccountFrequencyLastStepOnly ? ", last step only" : "";
            return $"[{string.Join(", ", itemSchedules)}] days [{string.Join(", ", itemDayCounts)}]{suffix}";
        }
    }
}
