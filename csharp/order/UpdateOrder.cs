using System;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;
using Newtonsoft.Json;

namespace SdkSample.order
{
    public class UpdateOrder
    {
        public static void Execute()
        {
            OrderApi orderApi = new OrderApi(Constants.ApiKey);

            string expansion = "checkout"; // see the getOrder sample for expansion discussion

            string orderId = "DEMO-0009104976";
            Order order = orderApi.GetOrder(orderId, expansion).Order;

            Console.WriteLine("Original Order follows:");
            Console.WriteLine(JsonConvert.SerializeObject(order, new JsonSerializerSettings { Formatting = Formatting.Indented}));
            

            // TODO: do some updates to the order.
            // For example:
            // order.BillingAddress.FirstName = "John";
            // order.BillingAddress.LastName = "Smith";

            OrderResponse apiResponse = orderApi.UpdateOrder(orderId, order,expansion);

            if (apiResponse.Error != null)
            {
                Console.Error.WriteLine(apiResponse.Error.DeveloperMessage);
                Console.Error.WriteLine(apiResponse.Error.UserMessage);
                return;
            }

            Order updatedOrder = apiResponse.Order;

            Console.WriteLine("Updated Order follows:");
            Console.WriteLine(JsonConvert.SerializeObject(updatedOrder, new JsonSerializerSettings { Formatting = Formatting.Indented}));
            
        }
        
    }
}