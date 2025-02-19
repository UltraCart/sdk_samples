using System;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.order
{
    public class ResendShipmentConfirmation
    {
        /*
         * OrderApi.resendShipmentConfirmation() will resend (email) a shipment confirmation to a customer.
         */
        public static void Execute()
        {
            OrderApi orderApi = new OrderApi(Constants.ApiKey);

            string orderId = "DEMO-0009104436";

            BaseResponse apiResponse = orderApi.ResendShipmentConfirmation(orderId);

            if (apiResponse.Error != null)
            {
                Console.Error.WriteLine(apiResponse.Error.DeveloperMessage);
                Console.Error.WriteLine(apiResponse.Error.UserMessage);
                Console.WriteLine("Order could not be adjusted. See error log.");
                return;
            }

            if (apiResponse.Success)
            {
                Console.WriteLine("Shipment confirmation was resent.");
            }
            else
            {
                Console.WriteLine("Failed to resend shipment confirmation.");
            }
        }
    }
}