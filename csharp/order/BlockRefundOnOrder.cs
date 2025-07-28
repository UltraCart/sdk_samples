using System;
using com.ultracart.admin.v2.Api;

namespace SdkSample.order
{
    public class BlockRefundOnOrder
    {
        /**
         * blockRefundOnOrder sets an order property that is considered when a refund request is made.
         * If the property is present, the refund is denied.  Being an order property allows for querying
         * upon it within BigQuery for audit purposes.
         */
        public static void Execute()
        {
            OrderApi orderApi = new OrderApi(Constants.ApiKey);

            string orderId = "DEMO-0009105222";
            orderApi.BlockRefundOnOrder(orderId, "Chargeback");
            Console.WriteLine("Method executed successfully.  Returns back 204 No Content.");

        }
    }
}