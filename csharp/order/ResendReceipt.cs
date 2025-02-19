using System;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.order
{
    public class ResendReceipt
    {
        /*
         * OrderApi.resendReceipt() will resend (email) a receipt to a customer.
         */
        public static void Execute()
        {
            OrderApi orderApi = new OrderApi(Constants.ApiKey);

            string orderId = "DEMO-0009104436";

            BaseResponse apiResponse = orderApi.ResendReceipt(orderId);

            if (apiResponse.Error != null)
            {
                Console.Error.WriteLine(apiResponse.Error.DeveloperMessage);
                Console.Error.WriteLine(apiResponse.Error.UserMessage);
                Console.WriteLine("Order receipt could not be resent. See error log.");
                return;
            }

            if (apiResponse.Success)
            {
                Console.WriteLine("Receipt was resent.");
            }
            else
            {
                Console.WriteLine("Failed to resend receipt.");
            }
        }
    }
}