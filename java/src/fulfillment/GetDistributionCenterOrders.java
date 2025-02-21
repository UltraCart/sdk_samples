package fulfillment;

import java.util.List;
import java.util.ArrayList;
import com.ultracart.admin.v2.FulfillmentApi;
import com.ultracart.admin.v2.models.Order;
import com.ultracart.admin.v2.models.OrdersResponse;
import com.ultracart.admin.v2.util.ApiException;

import common.Constants;

public class GetDistributionCenterOrders {
    /*
        getDistributionCenterOrders accepts a distribution center code and returns back up to 100 orders that need shipping.
        There is NO pagination with this method call. Once you receive the orders, you should insert them into your
        system, and acknowledge them via the acknowledgeOrders call. After you acknowledge the orders, subsequent calls
        to getDistributionCenterOrders will return another batch of 100 orders.

        The orders that are returned contain only items for THIS distribution center and are by default completely expanded
        with billing, channel_partner, checkout, coupons, customer_profile, edi, gift, gift_certificate, internal,
        items, payment, shipping, summary, taxes

        You will need the distribution center (DC) code. UltraCart allows for multiple DC and the code is a
        unique short string you assign to a DC as an easy mnemonic.

        For more information about UltraCart distribution centers, please see:
        https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377114/Distribution+Center

        If you do not know your DC code, query a list of all DC and print them out.
        DistributionCentersResponse result = fulfillmentApi.getDistributionCenters();
        System.out.println(result);
    */

    public static void execute() {
        FulfillmentApi fulfillmentApi = new FulfillmentApi(Constants.API_KEY);

        try {
            List<String> acknowledgedOrders = new ArrayList<>();
            String distributionCenterCode = "RAMI";
            OrdersResponse result = fulfillmentApi.getDistributionCenterOrders(distributionCenterCode);
            List<Order> orders = result.getOrders();
            
            for (Order order : orders) {
                System.out.println(order);
                // TODO: do something useful with this order, like adding it to your shipping queue.
                acknowledgedOrders.add(order.getOrderId());
            }

            // TODO: once you've securely and completely received it into your system, acknowledge the order.
            fulfillmentApi.acknowledgeOrders(distributionCenterCode, acknowledgedOrders);

            // After acknowledging orders, you should call getDistributionCenterOrders again until you receive zero orders to ship.

            System.out.println("done");
        } catch (Exception e) {
            // update inventory failed. examine the reason.
            System.out.println("Exception when calling FulfillmentApi.getDistributionCenterOrders: " + e.getMessage());
            System.exit(1);
        }
    }
}