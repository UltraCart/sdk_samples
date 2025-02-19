using System;
using System.Collections.Generic;
using System.Linq;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;
using Newtonsoft.Json;

namespace SdkSample.order
{
    public class GetOrdersByQuery
    {
        /*
         * This example illustrates how to query the OrderQuery object to select a range of records. It uses a subroutine
         * to aggregate the records that span multiple API calls. This example illustrates a work-around to selecting
         * all rejected orders. Because the UltraCart SDK does not have a way to query orders based on whether they
         * were rejected, we can instead query based on the rejected_dts, which is null if the order is not rejected.
         * So we will simply use a large time frame to ensure we query all rejections.
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

            foreach (Order order in orders)
            {
                Console.WriteLine(JsonConvert.SerializeObject(order, new JsonSerializerSettings { Formatting = Formatting.Indented}));                
            }            
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

            OrderQuery query = new OrderQuery();
            // Uncomment the next two lines to retrieve a single order. But there are simpler methods to do that.
            // string orderId = "DEMO-0009104390";
            // orderQuery.OrderId = orderId;

            string beginDts = DateTime.Now.AddDays(-2000).ToString("yyyy-MM-dd") + "T00:00:00+00:00"; // yes, that 2,000 days.
            string endDts = DateTime.Now.ToString("yyyy-MM-dd") + "T00:00:00+00:00";
            Console.Error.WriteLine(beginDts);
            Console.Error.WriteLine(endDts);

            query.RefundDateBegin = beginDts;
            query.RefundDateEnd = endDts;

            OrdersResponse apiResponse = orderApi.GetOrdersByQuery(query, limit, offset, null, expansion);
            if (apiResponse.Orders != null)
            {
                return apiResponse.Orders.ToList();
            }
            return new List<Order>();
        }
    }
}