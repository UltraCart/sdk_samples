using System;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;
using Newtonsoft.Json;

namespace SdkSample.order
{
    public class AssignRma
    {
        /*
         * OrderApi.assignRma() associates an RMA (return merchandise authorization) number with an order.
         * The rma is required, may be at most 30 characters, and is trimmed.  Any existing RMA on the order is
         * replaced, and a merchant note is added to the order recording the change.
         * Requires the order_write scope.
         *
         * Note: orders are located by RMA through a search index, so a just-assigned RMA may take a short time
         * to appear when calling getOrdersByRma.
         */
        public static void Execute()
        {
            OrderApi orderApi = new OrderApi(Constants.ApiKey);

            string orderId = "DEMO-0009104390";

            OrderAssignRmaRequest assignRmaRequest = new OrderAssignRmaRequest();
            assignRmaRequest.Rma = "RMA-12345";

            // The expansion is optional.  It controls how much of the updated order is returned.
            // see www.ultracart.com/api/ for all the expansion fields available
            string expansion = "item,summary,billing,shipping";

            OrderResponse apiResponse = orderApi.AssignRma(orderId, assignRmaRequest, expansion);

            if (apiResponse.Error != null)
            {
                Console.Error.WriteLine(apiResponse.Error.DeveloperMessage);
                Console.Error.WriteLine(apiResponse.Error.UserMessage);
                Environment.Exit(1);
            }

            Order order = apiResponse.Order;
            Console.WriteLine(JsonConvert.SerializeObject(order, new JsonSerializerSettings { Formatting = Formatting.Indented}));
        }
    }
}
