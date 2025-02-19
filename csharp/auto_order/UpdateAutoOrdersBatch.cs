using System;
using System.Collections.Generic;
using System.Reflection;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.auto_order
{
    public class UpdateAutoOrdersBatch
    {
        /*
         *
         * This method allows for updating multiple auto orders.
         * Warning: Take great care editing auto orders.  They are complex.
         * Sometimes you must change the original_order to affect the auto_order.  If you have questions about what fields
         * to update to achieve your desired change, contact UltraCart support.  Better to ask and get it right than to
         * make a bad assumption and corrupt a thousand auto orders.  UltraCart support is ready to assist.
         *
         */
        public static void Execute()
        {
            Console.WriteLine("--- " + MethodBase.GetCurrentMethod()?.DeclaringType?.Name + " ---");
            
            try
            {
                // Create auto order API instance using API key
                AutoOrderApi autoOrderApi = new AutoOrderApi(Constants.ApiKey);
                
                // The _async parameter is what it seems.  True if async.
                // The max records allowed depends on the async flag.  Synch max is 20, Asynch max is 100.
                
                bool async = true; // if true, success returns back a 204 No Content. False returns back the updated orders.
                string expand = null; // since we're async, nothing is returned, so we don't care about expansions.
                // If you are doing a synchronous operation, then set your expand appropriately. set getAutoOrders()
                // sample for expansion samples.
                bool placeholders = false; // mostly used for UI, not needed for a pure scripting operation.
                
                List<AutoOrder> autoOrders = new List<AutoOrder>(); // TODO: This should be a list of auto orders that have been updated. See any getAutoOrders method for retrieval.
                AutoOrdersRequest autoOrdersRequest = new AutoOrdersRequest();
                autoOrdersRequest.AutoOrders = autoOrders;
                
                var apiResponse = autoOrderApi.UpdateAutoOrdersBatch(autoOrdersRequest, expand, placeholders, async);
                if (apiResponse != null)
                {
                    // something went wrong if we have a response.
                    Console.WriteLine(apiResponse);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                Console.WriteLine(ex.StackTrace);
            }
        }
    }
}