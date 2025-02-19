using System;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.order
{
    public class AdjustOrderTotal
    {
        /**
         * OrderApi.adjustOrderTotal() takes a desired order total and performs goal-seeking to adjust all items and taxes
         * appropriately.  This method was created for merchants dealing with Medicare and Medicaid.  When selling their
         * medical devices, they would often run into limits approved by Medicare.  As such, they needed to adjust the
         * order total to match the approved amount.  This is a convenience method to adjust individual items and their
         * taxes to match the desired total.
         */
        public static void Execute()
        {
            OrderApi orderApi = new OrderApi(Constants.ApiKey);

            string orderId = "DEMO-0009104390";
            string desiredTotal = "21.99";
            BaseResponse apiResponse = orderApi.AdjustOrderTotal(orderId, desiredTotal);

            if (apiResponse.Error != null)
            {
                Console.Error.WriteLine(apiResponse.Error.DeveloperMessage);
                Console.Error.WriteLine(apiResponse.Error.UserMessage);
                Console.WriteLine("Order could not be adjusted. See error log.");
                return;
            }

            if (apiResponse.Success)
            {
                Console.WriteLine("Order was adjusted successfully. Use GetOrder() to retrieve the order if needed.");
            }
        }
    }
}