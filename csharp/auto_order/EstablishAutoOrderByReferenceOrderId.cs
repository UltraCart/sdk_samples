using System;
using System.Collections.Generic;
using System.Reflection;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.auto_order
{
    public class EstablishAutoOrderByReferenceOrderId
    {
        /*
         *
         * This method takes a normal order id and creates an empty auto order from it.  While this might seem useless having
         * an auto order with no items, the original_order is used for shipping, billing, and payment information.
         * Once you have your empty auto order, add items to it and call updateAutoOrder.
         *
         */
        public static void Execute()
        {
            Console.WriteLine("--- " + MethodBase.GetCurrentMethod()?.DeclaringType?.Name + " ---");
            
            try
            {
                // Create auto order API instance using API key
                AutoOrderApi autoOrderApi = new AutoOrderApi(Constants.ApiKey);
                
                string expand = "items,items.future_schedules,original_order,rebill_orders"; // see https://www.ultracart.com/api/#resource_auto_order.html for list
                
                string originalOrderId = "DEMO-123457";
                var apiResponse = autoOrderApi.EstablishAutoOrderByReferenceOrderId(originalOrderId, expand);
                
                AutoOrder emptyAutoOrder = apiResponse.AutoOrder;
                int autoOrderOid = emptyAutoOrder.AutoOrderOid;
                
                List<AutoOrderItem> items = new List<AutoOrderItem>();
                AutoOrderItem item = new AutoOrderItem();
                item.OriginalItemId = "ITEM_ABC"; // This item should be configured with auto order features.
                item.OriginalQuantity = 1;
                item.ArbitraryUnitCost = 59.99m;
                // Valid Frequencies
                // "Weekly", "Biweekly", "Every...", "Every 10 Days", "Every 4 Weeks", "Every 6 Weeks", "Every 8 Weeks", "Every 24 Days", "Every 28 Days", "Monthly",
                // "Every 45 Days", "Every 2 Months", "Every 3 Months", "Every 4 Months", "Every 5 Months", "Every 6 Months", "Yearly"
                item.Frequency = AutoOrderItem.FrequencyEnum.Monthly;
                items.Add(item);
                emptyAutoOrder.Items = items;
                
                string validateOriginalOrder = "No";
                var updateResponse = autoOrderApi.UpdateAutoOrder(autoOrderOid, emptyAutoOrder, validateOriginalOrder, expand);
                AutoOrder updatedAutoOrder = updateResponse.AutoOrder;
                Console.WriteLine(updatedAutoOrder);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                Console.WriteLine(ex.StackTrace);
            }
        }
    }
}