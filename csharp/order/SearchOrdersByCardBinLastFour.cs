using System;
using System.Collections.Generic;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.order
{
    public class SearchOrdersByCardBinLastFour
    {
        /*
         * Search orders by the card BIN (first six digits) plus the last four digits.
         *
         * A dispute or chargeback record from your gateway rarely carries the UltraCart order id, but it almost
         * always carries the card BIN, the last four digits, the transaction amount and the transaction date.
         * Matching on date + total + last four alone tends to return many orders, especially for subscription
         * merchants where rebills share the same amount. Adding the BIN pins the search to the specific card.
         *
         * Rules enforced by the API:
         *   - card_bin and card_last4 MUST be supplied together; neither works on its own.
         *   - card_bin is exactly 6 digits, card_last4 is exactly 4 digits (digits only).
         *   - ALWAYS send four digits in card_last4, including for American Express.
         *   - payment_date_begin AND payment_date_end are REQUIRED alongside the card fields.
         *   - The search is served from the cache; leave query_target unset (an explicit "origin" is rejected).
         *
         * A malformed card filter is a hard 400 rather than a silently ignored parameter, so you can never
         * mistake an unfiltered result set for a set of genuine card matches.
         *
         * The example values below are illustrative - substitute the BIN / last four / amount / dates from your
         * own gateway or chargeback record.
         */
        public static void Execute()
        {
            OrderApi orderApi = new OrderApi(Constants.ApiKey);
            string expansion = "summary,payment,billing";

            // Search #1 - reconcile a dispute using the card and a payment date window.
            // Widen the window about a week on either side of the transaction date. That is inexpensive here because
            // the card is doing the real narrowing, and it absorbs any timezone difference between your gateway's
            // reporting and the payment timestamp recorded on the order.
            OrderQuery query1 = new OrderQuery
            {
                CardBin = "427162",
                CardLast4 = "6258",
                PaymentDateBegin = "2026-07-14T00:00:00+00:00",
                PaymentDateEnd = "2026-07-28T23:59:59+00:00"
            };
            OrdersResponse response1 = orderApi.GetOrdersByQuery(query1, 200, 0, null, expansion);
            PrintMatches("Dispute reconciliation by card", response1);

            // Search #2 - add the transaction amount when you trust it.
            // Include total for extra precision. Leave it off when partial captures, surcharges or currency
            // conversion make an exact amount match unreliable.
            OrderQuery query2 = new OrderQuery
            {
                CardBin = "427162",
                CardLast4 = "6258",
                PaymentDateBegin = "2026-07-14T00:00:00+00:00",
                PaymentDateEnd = "2026-07-28T23:59:59+00:00",
                Total = 49.95m
            };
            OrdersResponse response2 = orderApi.GetOrdersByQuery(query2, 200, 0, null, expansion);
            PrintMatches("Dispute reconciliation by card and amount", response2);

            // Search #3 - American Express. Still send FOUR digits in card_last4.
            // The API applies the AMEX specific reduction internally; do not send three digits.
            OrderQuery query3 = new OrderQuery
            {
                CardBin = "371234",
                CardLast4 = "5678",
                PaymentDateBegin = "2026-07-14T00:00:00+00:00",
                PaymentDateEnd = "2026-07-28T23:59:59+00:00"
            };
            OrdersResponse response3 = orderApi.GetOrdersByQuery(query3, 200, 0, null, expansion);
            PrintMatches("American Express", response3);
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
