using System;
using System.Reflection;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.auto_order
{
    public class GetAutoOrder
    {
        /*
         * retrieves an auto_order given the auto_order_oid;
         */
        public static void Execute()
        {
            Console.WriteLine("--- " + MethodBase.GetCurrentMethod()?.DeclaringType?.Name + " ---");
            
            try
            {
                // Create auto order API instance using API key
                AutoOrderApi autoOrderApi = new AutoOrderApi(Constants.ApiKey);
                
                string expand = "items,items.future_schedules,original_order,rebill_orders"; // see https://www.ultracart.com/api/#resource_auto_order.html for list
                int autoOrderOid = 123456789; // If you don't know the oid, use getAutoOrdersByQuery for retrieving auto orders
                
                var apiResponse = autoOrderApi.GetAutoOrder(autoOrderOid, expand);
                AutoOrder autoOrder = apiResponse.AutoOrder;
                
                Console.WriteLine(autoOrder);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                Console.WriteLine(ex.StackTrace);
            }
        }
    }
}