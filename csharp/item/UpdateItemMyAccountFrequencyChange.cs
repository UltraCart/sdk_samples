using System;
using System.Collections.Generic;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Client;
using com.ultracart.admin.v2.Model;

namespace SdkSample.item
{
    public class UpdateItemMyAccountFrequencyChange
    {
        /*
         * Scenario: an item uses automatic enrollment (the customer is put on a fixed auto order schedule at checkout
         * and does not pick a frequency).  You want customers to be able to change the frequency of that item from
         * MyAccount, for example to Monthly, Every 2 Months, or every 30, 60 or 90 days.
         *
         * Three properties on item.auto_order control this:
         *   AutoOrderMyaccountFrequencySchedules     standard schedule names, e.g. "Monthly", "Every 2 Months"
         *   AutoOrderMyaccountFrequencyDayCounts     day counts, 1 to 365, at most 20, e.g. [30, 60, 90].  10, 24, 28
         *                                            and 45 are saved as the standard schedules "Every 10 Days" and so on.
         *   AutoOrderMyaccountFrequencyLastStepOnly  only offer the change once the item is on its last auto order step
         * Leave a list null to leave it unchanged.  Send an empty list to clear it.  Empty schedules and day counts turn
         * the MyAccount frequency change off for the item.
         *
         * C# note: AutoOrderMyaccountFrequencyLastStepOnly is a bool that is not sent when false.  That is fine here:
         * when the schedules or day counts are sent without last step only, UltraCart treats last step only as false.
         *
         * Requirements:
         * - UltraCart support must enable "MyAccount - Advanced Auto Order Settings" on your account.  Without it,
         *   setting these properties returns a 400.
         * - The item must use automatic enrollment (auto_order.auto_order_upsell = true).  Otherwise a 400.
         * - The change is only offered to a customer when the item's auto order steps repeat forever.  An item whose
         *   steps end (for example "Monthly x5, then stop") never offers it, whatever is set here.  UltraCart checks
         *   this when the customer asks, not when you save the item.
         *
         * Expansion matters here:
         * - Read the item with _expand=auto_order.  That returns the whole auto order section, including these
         *   properties.
         * - Send that same AutoOrder object back.  When auto_order is present in an update, UltraCart writes every auto
         *   order setting from it, so a partial or hand-built AutoOrder object would reset settings you did not mean
         *   to touch.
         * - Do NOT add auto_order.steps to the expansion.  If steps are present in the update they replace the item's
         *   steps.  Leaving them out leaves the steps alone.
         *
         * What the customer sees: the allowed frequencies are offered on the auto order item in MyAccount.  A change
         * takes effect after the next shipment; the next shipment date does not move.
         */
        public static void Execute()
        {
            ItemApi itemApi = new ItemApi(Constants.ApiKey);

            string merchantItemId = "AUTOSHIP-30"; // change_me: an item that uses automatic enrollment
            string expand = "auto_order";          // NOT auto_order.steps, see above

            try
            {
                // Step 1. Read the item with its auto order section.
                ItemResponse itemResponse = itemApi.GetItemByMerchantItemId(merchantItemId, expand, false);
                if (itemResponse.Error != null)
                {
                    Console.Error.WriteLine(itemResponse.Error.DeveloperMessage);
                    Console.Error.WriteLine(itemResponse.Error.UserMessage);
                    return;
                }
                Item item = itemResponse.Item;
                ItemAutoOrder autoOrder = item.AutoOrder;

                // Step 2. Make sure the item uses automatic enrollment.
                if (autoOrder == null || !autoOrder.AutoOrderUpsell)
                {
                    Console.WriteLine($"Item {merchantItemId} does not use automatic enrollment.  Nothing to do.");
                    return;
                }

                Console.WriteLine("Before:");
                PrintSettings(autoOrder);

                // Step 3. Set the frequencies a customer may switch to.  Everything else in AutoOrder is sent back as read.
                autoOrder.AutoOrderMyaccountFrequencySchedules = new List<string> { "Monthly", "Every 2 Months", "Every 3 Months" };
                autoOrder.AutoOrderMyaccountFrequencyDayCounts = new List<int> { 30, 60, 90 };
                autoOrder.AutoOrderMyaccountFrequencyLastStepOnly = false; // not sent when false; see the C# note above

                // To turn the change off for this item instead:
                // autoOrder.AutoOrderMyaccountFrequencySchedules = new List<string>();
                // autoOrder.AutoOrderMyaccountFrequencyDayCounts = new List<int>();

                // Step 4. Save.  The same expansion returns the saved auto order section.
                ItemResponse updateResponse = itemApi.UpdateItem(item.MerchantItemOid, item, expand, false);
                if (updateResponse.Error != null)
                {
                    Console.Error.WriteLine(updateResponse.Error.DeveloperMessage);
                    Console.Error.WriteLine(updateResponse.Error.UserMessage);
                    return;
                }

                Console.WriteLine("After:");
                PrintSettings(updateResponse.Item.AutoOrder);
            }
            catch (ApiException e)
            {
                // A 400 explains itself: feature not enabled on the account, item not automatic enrollment,
                // unknown schedule name, or a bad day count.
                Console.WriteLine("An ApiException occurred.  Please review the following error:");
                Console.WriteLine($"{e.ErrorCode} {e.ErrorContent}");
            }
        }

        private static void PrintSettings(ItemAutoOrder autoOrder)
        {
            if (autoOrder == null)
            {
                Console.WriteLine("  (no auto order section)");
                return;
            }
            List<string> schedules = autoOrder.AutoOrderMyaccountFrequencySchedules;
            List<int> dayCounts = autoOrder.AutoOrderMyaccountFrequencyDayCounts;
            Console.WriteLine("  Schedules: " + (schedules == null || schedules.Count == 0 ? "(none)" : string.Join(", ", schedules)));
            Console.WriteLine("  Day counts: " + (dayCounts == null || dayCounts.Count == 0 ? "(none)" : string.Join(", ", dayCounts)));
            Console.WriteLine("  Last step only: " + autoOrder.AutoOrderMyaccountFrequencyLastStepOnly);
        }
    }
}
