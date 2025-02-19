using System;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.order
{
    public class CancelOrder
    {
        /**
         * OrderApi.CancelOrder() will do just that.  It will cancel an order by rejecting it.
         * However, the following restrictions apply:
         * 1) If the order is already completed, this call will fail.
         * 2) If the order has already been rejected, this call will fail.
         * 3) If the order has already been transmitted to a fulfillment center, this call will fail.
         * 4) If the order is queued for transmission to a distribution center, this call will fail.
         */
        public static void Execute()
        {
            OrderApi orderApi = new OrderApi(Constants.ApiKey);

            string orderId = "DEMO-0009104390";
            BaseResponse apiResponse = orderApi.CancelOrder(orderId);

            if (apiResponse.Error != null)
            {
                Console.Error.WriteLine(apiResponse.Error.DeveloperMessage);
                Console.Error.WriteLine(apiResponse.Error.UserMessage);
                Console.WriteLine("Order could not be canceled. See error log.");
                return;
            }

            if (apiResponse.Success)
            {
                Console.WriteLine("Order was canceled successfully.");
            }
        }
    }
}