using System;
using System.Collections.Generic;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;
using Newtonsoft.Json;

namespace SdkSample.order
{
    public class GetOrdersByRma
    {
        /*
         * OrderApi.getOrdersByRma() retrieves the orders associated with an RMA number.
         * The RMA must be an exact match; wildcards (*) are not permitted and will return a 400 error.
         * Multiple orders can share the same RMA, so a list of orders is returned.
         * Requires the order_read scope.
         *
         * Note: this lookup is backed by a search index, so an RMA that was just assigned (see assignRma)
         * may take a short time to appear in the results.
         */
        public static void Execute()
        {
            OrderApi orderApi = new OrderApi(Constants.ApiKey);

            // see www.ultracart.com/api/ for all the expansion fields available
            string expansion = "item,summary,billing,shipping";

            string rma = "RMA-12345";
            OrdersResponse apiResponse = orderApi.GetOrdersByRma(rma, expansion);

            if (apiResponse.Error != null)
            {
                Console.Error.WriteLine(apiResponse.Error.DeveloperMessage);
                Console.Error.WriteLine(apiResponse.Error.UserMessage);
                Environment.Exit(1);
            }

            List<Order> orders = apiResponse.Orders;
            Console.WriteLine("Orders found for RMA " + rma + ": " + orders.Count);
            foreach (Order order in orders)
            {
                Console.WriteLine(JsonConvert.SerializeObject(order, new JsonSerializerSettings { Formatting = Formatting.Indented}));
            }
        }
    }
}
