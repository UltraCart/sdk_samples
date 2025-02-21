package order;

import com.ultracart.admin.v2.OrderApi;
import com.ultracart.admin.v2.models.*;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

public class GetOrdersBatch {
    /*
     * This method is useful when you need to query a defined set of orders and would like to avoid querying them
     * one at a time.
     */
    public static void execute() throws ApiException {
        OrderApi orderApi = new OrderApi(Constants.API_KEY);

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

        OrderQueryBatch orderBatch = new OrderQueryBatch();
        List<String> orderIds = Arrays.asList("DEMO-0009104390", "DEMO-0009104391", "DEMO-0009104392");
        orderBatch.setOrderIds(orderIds);

        OrdersResponse apiResponse = orderApi.getOrdersBatch(orderBatch, expansion);

        if (apiResponse.getError() != null) {
            System.err.println(apiResponse.getError().getDeveloperMessage());
            System.err.println(apiResponse.getError().getUserMessage());
            System.exit(1);
        }

        List<Order> orders = apiResponse.getOrders();
        if (orders.isEmpty()) {
            System.err.println("There were no orders returned by this query.");
        }

        // do something with the orders. for this example, we're just accessing many properties as illustration.
        for (Order order : orders) {
            OrderSummary summary = order.getSummary();
            BigDecimal actualShippingCost = summary.getActualShipping() != null ? summary.getActualShipping().getLocalized() : BigDecimal.ZERO;

            Order.CurrentStageEnum currentStage = order.getCurrentStage();
            OrderShipping sAddr = order.getShipping();
            List<String> trackingNumbers = sAddr.getTrackingNumbers();
            for (String trackingNumber : trackingNumbers) {
                // do something with tracking number here.
            }

            // Here's how to access the shipping information. Do something with the variables.
            String sfname = order.getShipping().getFirstName();
            String slname = order.getShipping().getLastName();
            String saddress1 = order.getShipping().getAddress1();
            String saddress2 = order.getShipping().getAddress2();
            String scity = order.getShipping().getCity();
            String sregion = order.getShipping().getStateRegion();
            String sccode = order.getShipping().getCountryCode();
            String spcode = order.getShipping().getPostalCode();
            String sdayphone = order.getShipping().getDayPhone();
            String shippingMethod = order.getShipping().getShippingMethod();

            // Here's how to access the billing information. Do something with the variables.
            String billingAddress1 = order.getBilling().getAddress1();
            String billingAddress2 = order.getBilling().getAddress2();
            String billingCity = order.getBilling().getCity();
            String billingStateRegion = order.getBilling().getStateRegion();
            String billingCountryCode = order.getBilling().getCountryCode();
            String billingPostalCode = order.getBilling().getPostalCode();
            String email = order.getBilling().getEmail(); // email is located on the billing object.

            // here is how to access the items
            List<OrderItem> items = order.getItems();
            for (OrderItem item : items) {
                BigDecimal qty = item.getQuantity();
                String itemId = item.getMerchantItemId();
                String description = item.getDescription();
                BigDecimal cost = item.getCost().getLocalized();
                String costFormatted = item.getCost().getLocalizedFormatted(); // cost with symbols.
            }
        }

        // this could get verbose depending on the size of your batch ...
        for (Order order : orders) {
            System.out.println(order.toString());
        }
    }
}