using System;
using System.Collections.Generic;
using System.Reflection;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.auto_order
{
    public class ConsolidateAutoOrders
    {
        /*
         *
         * consolidateAutoOrders
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
                
                int targetAutoOrderOid = 123456789; // set getAutoOrdersByQuery for retrieving auto orders where you can get their auto_order_oid.
                AutoOrderConsolidate consolidateRequest = new AutoOrderConsolidate();
                consolidateRequest.SourceAutoOrderOids = new List<int> { 23456789, 3456789 }; // these are the autoorder_oids you wish to consolidate into the target.
                
                var apiResponse = autoOrderApi.ConsolidateAutoOrders(targetAutoOrderOid, consolidateRequest, expand);
                
                var consolidatedAutoOrder = apiResponse.AutoOrder;
                
                // TODO: make sure the consolidated order has all the items and history of all orders.
                Console.WriteLine(consolidatedAutoOrder);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                Console.WriteLine(ex.StackTrace);
            }
        }
    }
}