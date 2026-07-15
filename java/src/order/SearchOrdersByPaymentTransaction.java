package order;

import com.ultracart.admin.v2.OrderApi;
import com.ultracart.admin.v2.models.Order;
import com.ultracart.admin.v2.models.OrderQuery;
import com.ultracart.admin.v2.models.OrderQueryPaymentTransactionFilter;
import com.ultracart.admin.v2.models.OrdersResponse;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class SearchOrdersByPaymentTransaction {
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
    public static void execute() throws ApiException {
        OrderApi orderApi = new OrderApi(Constants.API_KEY);
        String expansion = "summary,payment,payment.transaction";

        // Search #1 - reverse-lookup an order from a gateway transaction id.
        // The two filters are AND-ed against the SAME transaction: the rotating gateway code AND the gateway transaction id.
        OrderQueryPaymentTransactionFilter gatewayFilter = new OrderQueryPaymentTransactionFilter();
        gatewayFilter.setName("rotatingTransactionGatewayCode");
        gatewayFilter.setValue("NMI");
        OrderQueryPaymentTransactionFilter transactionIdFilter = new OrderQueryPaymentTransactionFilter();
        transactionIdFilter.setName("transactionid");
        transactionIdFilter.setValue("12244247793");
        // Tip: to match a value under ANY detail name, leave name unset.

        OrderQuery query1 = new OrderQuery();
        query1.setQueryTarget(OrderQuery.QueryTargetEnum.CACHE); // transaction-detail search requires the cache
        query1.setPaymentTransactionFilters(Arrays.asList(gatewayFilter, transactionIdFilter));

        OrdersResponse response1 = orderApi.getOrdersByQuery(query1, 200, 0, null, expansion);
        printMatches("Search by transaction id", response1);

        // Search #2 - reconcile a chargeback when you do not have the order id.
        // The auth code from the chargeback file is stored as the "authcode" detail; combine it with the
        // transaction amount (total) and a payment date window to uniquely identify the order.
        OrderQueryPaymentTransactionFilter authcodeFilter = new OrderQueryPaymentTransactionFilter();
        authcodeFilter.setName("authcode");
        authcodeFilter.setValue("100304");

        OrderQuery query2 = new OrderQuery();
        query2.setQueryTarget(OrderQuery.QueryTargetEnum.CACHE);
        query2.setPaymentTransactionFilters(Arrays.asList(authcodeFilter));
        query2.setTotal(new BigDecimal("77.00"));
        query2.setPaymentDateBegin("2026-06-29T00:00:00+00:00");
        query2.setPaymentDateEnd("2026-07-01T00:00:00+00:00");

        OrdersResponse response2 = orderApi.getOrdersByQuery(query2, 200, 0, null, expansion);
        printMatches("Chargeback reconciliation", response2);
    }

    private static void printMatches(String label, OrdersResponse response) {
        List<Order> orders = response.getOrders() != null ? response.getOrders() : new ArrayList<>();
        System.out.println(label + ": " + orders.size() + " order(s) matched");
        for (Order order : orders) {
            System.out.println("  " + order.getOrderId());
        }
    }
}
