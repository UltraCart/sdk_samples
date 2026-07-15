using System;
using System.Collections.Generic;
using System.Linq;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.order
{
    public class SearchOrdersByPaymentTransaction
    {
        /*
         * Search orders by the key/value pairs recorded on a payment transaction.
         *
         * Each payment transaction stores the gateway's response as a set of name/value detail pairs
         * (payment.transactions[].details[], e.g. authcode, transactionid, rotatingTransactionGatewayCode).
         * The payment_transaction_filters field on the order query matches against those pairs, letting you
         * reverse-lookup an order from a gateway/processor transaction id, or reconcile a chargeback.
         *
         * Rules enforced by the API:
         *   - query_target MUST be "cache" (ElasticSearch); the database path cannot search transaction details.
         *   - Each filter value is REQUIRED and matched EXACTLY (no wildcards).
         *   - A filter name is OPTIONAL; omit it to match the value across any detail name.
         *   - Multiple filters are AND-ed against the SAME transaction (the rotating gateway is just another pair).
         *   - At most 10 filters are allowed.
         *
         * The example values below are illustrative - substitute the transaction id / auth code / amount / dates
         * from your own gateway or chargeback record.
         */
        public static void Execute()
        {
            OrderApi orderApi = new OrderApi(Constants.ApiKey);
            string expansion = "summary,payment,payment.transaction";

            // Search #1 - reverse-lookup an order from a gateway transaction id.
            // The two filters are AND-ed against the SAME transaction: the rotating gateway code AND the gateway transaction id.
            OrderQuery query1 = new OrderQuery
            {
                QueryTarget = OrderQuery.QueryTargetEnum.Cache, // transaction-detail search requires the cache
                PaymentTransactionFilters = new List<OrderQueryPaymentTransactionFilter>
                {
                    new OrderQueryPaymentTransactionFilter(name: "rotatingTransactionGatewayCode", value: "NMI"),
                    new OrderQueryPaymentTransactionFilter(name: "transactionid", value: "12244247793")
                    // Tip: to match a value under ANY detail name, omit name: new OrderQueryPaymentTransactionFilter(value: "12244247793")
                }
            };
            OrdersResponse response1 = orderApi.GetOrdersByQuery(query1, 200, 0, null, expansion);
            PrintMatches("Search by transaction id", response1);

            // Search #2 - reconcile a chargeback when you do not have the order id.
            // The auth code from the chargeback file is stored as the "authcode" detail; combine it with the
            // transaction amount (total) and a payment date window to uniquely identify the order.
            OrderQuery query2 = new OrderQuery
            {
                QueryTarget = OrderQuery.QueryTargetEnum.Cache,
                PaymentTransactionFilters = new List<OrderQueryPaymentTransactionFilter>
                {
                    new OrderQueryPaymentTransactionFilter(name: "authcode", value: "100304")
                },
                Total = 77.00m,
                PaymentDateBegin = "2026-06-29T00:00:00+00:00",
                PaymentDateEnd = "2026-07-01T00:00:00+00:00"
            };
            OrdersResponse response2 = orderApi.GetOrdersByQuery(query2, 200, 0, null, expansion);
            PrintMatches("Chargeback reconciliation", response2);
        }

        private static void PrintMatches(string label, OrdersResponse response)
        {
            List<Order> orders = response.Orders ?? new List<Order>();
            Console.WriteLine($"{label}: {orders.Count} order(s) matched");
            foreach (Order order in orders)
            {
                Console.WriteLine($"  {order.OrderId}");
            }
        }
    }
}
