using System;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.order
{
    public class GetUpdateBillingUrl
    {
        /*
         * OrderApi.getUpdateBillingUrl() generates the url a customer can use to update the billing information
         * on the auto order associated with this order.  This is the same url sent in the auto order update
         * billing email.  The order must belong to an auto order or a 400 error is returned.  Either the original
         * order or any rebill order of the auto order may be used.
         * Requires the order_write scope, because the url carries a customer access token.
         */
        public static void Execute()
        {
            OrderApi orderApi = new OrderApi(Constants.ApiKey);

            string orderId = "DEMO-0009104390"; // must be the original order or a rebill order of an auto order

            OrderAutoOrderUpdateBillingUrlResponse apiResponse = orderApi.GetUpdateBillingUrl(orderId);

            if (apiResponse.Error != null)
            {
                Console.Error.WriteLine(apiResponse.Error.DeveloperMessage);
                Console.Error.WriteLine(apiResponse.Error.UserMessage);
                Environment.Exit(1);
            }

            // WARNING: the update billing url grants access to the customer's billing information.
            // Do not log it or expose it publicly in production.  Deliver it only to the customer.
            Console.WriteLine("Update billing url: " + apiResponse.UpdateBillingUrl);
        }
    }
}
