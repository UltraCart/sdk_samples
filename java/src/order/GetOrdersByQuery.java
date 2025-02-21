package order;

import com.ultracart.admin.v2.OrderApi;
import com.ultracart.admin.v2.models.Order;
import com.ultracart.admin.v2.models.OrderQuery;
import com.ultracart.admin.v2.models.OrdersResponse;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

public class GetOrdersByQuery {
    /*
     * This example illustrates how to query the OrderQuery object to select a range of records. It uses a subroutine
     * to aggregate the records that span multiple API calls. This example illustrates a work-around to selecting
     * all rejected orders. Because the UltraCart SDK does not have a way to query orders based on whether they
     * were rejected, we can instead query based on the rejected_dts, which is null if the order is not rejected.
     * So we will simply use a large time frame to ensure we query all rejections.
     */
    public static void execute() throws ApiException {
        OrderApi orderApi = new OrderApi(Constants.API_KEY);

        List<Order> orders = new ArrayList<>();

        int iteration = 1;
        int offset = 0;
        int limit = 200;
        boolean moreRecordsToFetch = true;

        while (moreRecordsToFetch) {
            System.out.println("executing iteration " + iteration + "<br>");
            List<Order> chunkOfOrders = getOrderChunk(orderApi, offset, limit);
            orders.addAll(chunkOfOrders);
            offset = offset + limit;
            moreRecordsToFetch = chunkOfOrders.size() == limit;
            iteration++;
        }

        for (Order order : orders) {
            System.out.println(order.toString());
        }
    }

    private static List<Order> getOrderChunk(OrderApi orderApi, int offset, int limit) throws ApiException {
        String expansion = "item,summary,billing,shipping,shipping.tracking_number_details";
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
        // String orderId = "DEMO-0009104390";
        // orderQuery.setOrderId(orderId);

        String beginDts = Instant.now().toString();
        String endDts = Instant.now().minus(2000, ChronoUnit.DAYS).toString();
        System.err.println(beginDts);
        System.err.println(endDts);

        query.setRefundDateBegin(beginDts);
        query.setRefundDateEnd(endDts);

        OrdersResponse apiResponse = orderApi.getOrdersByQuery(query, limit, offset, null, expansion);
        if (apiResponse.getOrders() != null) {
            return apiResponse.getOrders();
        }
        return new ArrayList<>();
    }
}