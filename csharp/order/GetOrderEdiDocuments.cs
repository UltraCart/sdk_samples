using System;
using System.Collections.Generic;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;
using Newtonsoft.Json;

namespace SdkSample.order
{
    public class GetOrderEdiDocuments
    {
        /*
            getOrderEdiDocuments returns back all EDI documents associated with an order.

            Possible Errors:
            Order.channelPartnerOid is null -> "Order is not associated with an EDI channel partner."
         */
        public static void Execute()
        {
            OrderApi orderApi = new OrderApi(Constants.ApiKey);

            string orderId = "DEMO-0009104976";
            OrderEdiDocumentsResponse response = orderApi.GetOrderEdiDocuments(orderId);
            List<OrderEdiDocument> documents = response.EdiDocuments;

            foreach (OrderEdiDocument doc in documents)
            {
                Console.WriteLine(JsonConvert.SerializeObject(doc,
                    new JsonSerializerSettings { Formatting = Formatting.Indented }));
            }
            
        }
    }
}