using System;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.order
{
    public class DeleteOrder
    {
        /**
         * OrderApi.DeleteOrder() will do just that.  It will delete an order.
         * You might find it more useful to reject an order rather than delete it in order to leave an audit trail.
         * However, deleting test orders will be useful to keep your order history tidy.  Still, any order
         * may be deleted.
         */
        public static void Execute()
        {
            OrderApi orderApi = new OrderApi(Constants.ApiKey);

            string orderId = "DEMO-0008104390";
            orderApi.DeleteOrder(orderId);
            Console.WriteLine("Order was deleted successfully.");
        }
    }
}