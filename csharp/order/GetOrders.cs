using System;
using System.Collections.Generic;
using System.Linq;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;
using Newtonsoft.Json;

namespace SdkSample.order
{
    public class GetOrders
    {
        /*
         * getOrders was the first order query provided by UltraCart. It still functions well, but it is extremely verbose
         * because the query call takes a variable for every possible filter. You are advised to get getOrdersByQuery().
         * It is easier to use and will result in less code. Still, we provide an example here to be thorough.
         *
         * For this email, we will query all orders for a particular email address. The getOrdersByQuery() example
         * illustrates using a date range to filter and select orders.
         */
        public static void Execute()
        {
            OrderApi orderApi = new OrderApi(Constants.ApiKey);

            List<Order> orders = new List<Order>();

            int iteration = 1;
            int offset = 0;
            int limit = 200;
            bool moreRecordsToFetch = true;

            while (moreRecordsToFetch)
            {
                Console.WriteLine($"executing iteration {iteration}<br>");
                List<Order> chunkOfOrders = GetOrderChunk(orderApi, offset, limit);
                orders.AddRange(chunkOfOrders);
                offset = offset + limit;
                moreRecordsToFetch = chunkOfOrders.Count == limit;
                iteration++;
            }

            // this could get verbose...
            foreach (Order order in orders)
            {
                Console.WriteLine(JsonConvert.SerializeObject(order, new JsonSerializerSettings { Formatting = Formatting.Indented}));                
            }
            
            Console.WriteLine("<html lang=\"en\"><body><pre>");
            Console.WriteLine(orders);
            Console.WriteLine("</pre></body></html>");
        }

        private static List<Order> GetOrderChunk(OrderApi orderApi, int offset, int limit)
        {
            string expansion = "item,summary,billing,shipping,shipping.tracking_number_details";
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

            string orderId = null;
            string paymentMethod = null;
            string company = null;
            string firstName = null;
            string lastName = null;
            string city = null;
            string stateRegion = null;
            string postalCode = null;
            string countryCode = null;
            string phone = null;
            string email = "support@ultracart.com"; // <-- this is the only filter we're using.
            string ccEmail = null;
            decimal? total = null;
            string screenBrandingThemeCode = null;
            string storefrontHostName = null;
            string creationDateBegin = null;
            string creationDateEnd = null;
            string paymentDateBegin = null;
            string paymentDateEnd = null;
            string shipmentDateBegin = null;
            string shipmentDateEnd = null;
            string rma = null;
            string purchaseOrderNumber = null;
            string itemId = null;
            string currentStage = null;
            string channelPartnerCode = null;
            string channelPartnerOrderId = null;
            string sort = null;

            // see all these parameters? that is why you should use getOrdersByQuery() instead of getOrders()
            OrdersResponse apiResponse = orderApi.GetOrders(orderId, paymentMethod, company, firstName, lastName, city,
                stateRegion, postalCode, countryCode, phone, email, ccEmail, total, screenBrandingThemeCode,
                storefrontHostName, creationDateBegin, creationDateEnd, paymentDateBegin, paymentDateEnd,
                shipmentDateBegin, shipmentDateEnd, rma, purchaseOrderNumber, itemId, currentStage,
                channelPartnerCode, channelPartnerOrderId, limit, offset, sort, expansion);

            if (apiResponse.Orders != null)
            {
                return apiResponse.Orders.ToList();
            }
            return new List<Order>();
        }
    }
}