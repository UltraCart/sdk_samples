using System;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;
using Newtonsoft.Json;

namespace SdkSample.order
{
    public class GetOrder
    {
        /*
         * OrderApi.getOrder() retrieves a single order for a given order_id.
         */
        public static void Execute()
        {
            OrderApi orderApi = new OrderApi(Constants.ApiKey);

            // The expansion variable instructs UltraCart how much information to return.  The order object is large and
            // while it's easily manageable for a single order, when querying thousands of orders, is useful to reduce
            // payload size.
            // see www.ultracart.com/api/ for all the expansion fields available (this list below may become stale)
            /*
            Possible Order Expansions:
            affiliate           affiliate.ledger                    auto_order
            billing             channel_partner                     checkout
            coupon              customer_profile                    digital_order
            edi                 fraud_score                         gift
            gift_certificate    internal                            item
            linked_shipment     marketing                           payment
            payment.transaction quote                               salesforce
            shipping            shipping.tracking_number_details    summary
            taxes
            */
            string expansion = "item,summary,billing,shipping,shipping.tracking_number_details";

            string orderId = "DEMO-0009104390";
            OrderResponse apiResponse = orderApi.GetOrder(orderId, expansion);

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