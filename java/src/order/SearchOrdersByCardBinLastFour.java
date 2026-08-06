package order;

import com.ultracart.admin.v2.OrderApi;
import com.ultracart.admin.v2.models.Order;
import com.ultracart.admin.v2.models.OrderQuery;
import com.ultracart.admin.v2.models.OrdersResponse;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class SearchOrdersByCardBinLastFour {
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
    public static void execute() throws ApiException {
        OrderApi orderApi = new OrderApi(Constants.API_KEY);
        String expansion = "summary,payment,billing";

        // Search #1 - reconcile a dispute using the card and a payment date window.
        // Widen the window about a week on either side of the transaction date. That is inexpensive here because
        // the card is doing the real narrowing, and it absorbs any timezone difference between your gateway's
        // reporting and the payment timestamp recorded on the order.
        OrderQuery query1 = new OrderQuery();
        query1.setCardBin("427162");
        query1.setCardLast4("6258");
        query1.setPaymentDateBegin("2026-07-14T00:00:00+00:00");
        query1.setPaymentDateEnd("2026-07-28T23:59:59+00:00");

        OrdersResponse response1 = orderApi.getOrdersByQuery(query1, 200, 0, null, expansion);
        printMatches("Dispute reconciliation by card", response1);

        // Search #2 - add the transaction amount when you trust it.
        // Include total for extra precision. Leave it off when partial captures, surcharges or currency
        // conversion make an exact amount match unreliable.
        OrderQuery query2 = new OrderQuery();
        query2.setCardBin("427162");
        query2.setCardLast4("6258");
        query2.setPaymentDateBegin("2026-07-14T00:00:00+00:00");
        query2.setPaymentDateEnd("2026-07-28T23:59:59+00:00");
        query2.setTotal(new BigDecimal("49.95"));

        OrdersResponse response2 = orderApi.getOrdersByQuery(query2, 200, 0, null, expansion);
        printMatches("Dispute reconciliation by card and amount", response2);

        // Search #3 - American Express. Still send FOUR digits in card_last4.
        // The API applies the AMEX specific reduction internally; do not send three digits.
        OrderQuery query3 = new OrderQuery();
        query3.setCardBin("371234");
        query3.setCardLast4("5678");
        query3.setPaymentDateBegin("2026-07-14T00:00:00+00:00");
        query3.setPaymentDateEnd("2026-07-28T23:59:59+00:00");

        OrdersResponse response3 = orderApi.getOrdersByQuery(query3, 200, 0, null, expansion);
        printMatches("American Express", response3);
    }

    private static void printMatches(String label, OrdersResponse response) {
        List<Order> orders = response.getOrders() != null ? response.getOrders() : new ArrayList<>();
        System.out.println(label + ": " + orders.size() + " order(s) matched");
        for (Order order : orders) {
            System.out.println("  " + order.getOrderId());
        }
    }
}
