using System;
using System.Reflection;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.auto_order
{
    public class GetAutoOrderUpdateBillingUrl
    {
        /*
         * AutoOrderApi.getAutoOrderUpdateBillingUrl() generates the url a customer can use to update the billing
         * information on an auto order.  This is the same url sent in the auto order update billing email.
         * Requires the auto_order_write scope, because the url carries a customer access token.
         */
        public static void Execute()
        {
            Console.WriteLine("--- " + MethodBase.GetCurrentMethod()?.DeclaringType?.Name + " ---");

            try
            {
                // Create auto order API instance using API key
                AutoOrderApi autoOrderApi = new AutoOrderApi(Constants.ApiKey);

                int autoOrderOid = 123456789; // If you don't know the oid, use getAutoOrdersByQuery for retrieving auto orders

                OrderAutoOrderUpdateBillingUrlResponse apiResponse = autoOrderApi.GetAutoOrderUpdateBillingUrl(autoOrderOid);

                // WARNING: the update billing url grants access to the customer's billing information.
                // Do not log it or expose it publicly in production.  Deliver it only to the customer.
                Console.WriteLine("Update billing url: " + apiResponse.UpdateBillingUrl);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                Console.WriteLine(ex.StackTrace);
            }
        }
    }
}
