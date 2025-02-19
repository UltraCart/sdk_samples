using System;
using System.Reflection;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.auto_order
{
    public class UpdateAutoOrder
    {
        /*
         *
         * This method allows for updating an auto order.
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
                
                string expand = "items,items.future_schedules,original_order,rebill_orders"; // see https://www.ultracart.com/api/#resource_auto_order.html for list
                int autoOrderOid = 123456789; // get an auto order and update it. There are many ways to retrieve an auto order.
                var apiResponse = autoOrderApi.GetAutoOrder(autoOrderOid);
                AutoOrder autoOrder = apiResponse.AutoOrder;
                string validateOriginalOrder = "No";
                
                // for this example, the customer supplied the wrong postal code when ordering. So to change the postal code for
                // all subsequent auto orders, we change the original order.
                autoOrder.OriginalOrder.Billing.PostalCode = "44233";
                
                var updateResponse = autoOrderApi.UpdateAutoOrder(autoOrderOid, autoOrder, validateOriginalOrder, expand);
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