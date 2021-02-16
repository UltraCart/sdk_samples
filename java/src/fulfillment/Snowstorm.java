

package fulfillment;

import com.ultracart.admin.v2.OrderApi;
import com.ultracart.admin.v2.models.Order;
import com.ultracart.admin.v2.models.OrderQuery;
import com.ultracart.admin.v2.models.OrdersResponse;
import com.ultracart.admin.v2.swagger.ApiException;

import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

public class Snowstorm {
    private static final String expand = "shipping";

    /*
    What this does:
    Find all the orders in the shipping department and move their shipOn date forward a few days because a snowstorm
    has shut down FedEx for a few days.
     */

    public static void main(String[] args) throws ApiException, InterruptedException {

        // ---------------------------------------
        // ---------------------------------------
        // ---------------------------------------
        final String NEW_SHIP_DATE = "02/22/2021";
        // ---------------------------------------
        // ---------------------------------------
        // ---------------------------------------


        final DateTimeFormatter df = DateTimeFormatter.ISO_OFFSET_DATE_TIME;
        final OffsetDateTime newShipDts = OffsetDateTime.parse(NEW_SHIP_DATE + " 00:09:00-0500", DateTimeFormatter.ofPattern("MM/dd/yyyy HH:mm:ssZ"));

        // Create a Simple Key: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/38688545/API+Simple+Key
        final String apiKey = "109ee846ee69f50177018ab12f008a00748a25aa28dbdc0177018ab12f008a00";
        OrderApi orderApi = new OrderApi(apiKey, false, false);


        ArrayList<Order> orders = new ArrayList<>();
        int iteration = 1;
        int offset = 0;
        int limit = 200;
        boolean needMoreRecords = true;
        while(needMoreRecords){

            System.out.println("executing getOrders() iteration #" + iteration );
            List<Order> blockOfOrders = getOrdersInShipping(orderApi, offset, limit);
            orders.addAll(blockOfOrders);

            offset += limit;
            needMoreRecords = blockOfOrders.size() == limit;
            Thread.sleep(1000);
            iteration++;
        }


        for (Order order : orders) {

            String shipOnDate = order.getShipping().getShipOnDate();
            String deliveryDate = order.getShipping().getDeliveryDate();

            if(shipOnDate == null || deliveryDate == null){
                System.out.println("Warning: Order " + order.getOrderId() + " is missing a ShipOn or Delivery Date.  Could not adjust.");
                continue;
            }

            OffsetDateTime shipDts = OffsetDateTime.parse( shipOnDate, df);
            if(shipDts.compareTo(newShipDts) >= 0){
                System.out.println("Warning: Order " + order.getOrderId() + " skipping because it already ships on or after Monday.");
                continue;
            }

            OffsetDateTime deliverDts = OffsetDateTime.parse( deliveryDate, df);
            long daysToDeliver = Math.abs(deliverDts.until(shipDts, ChronoUnit.DAYS)); // only need the abs for testing, really.

            OffsetDateTime newDeliverDts = newShipDts.plus(daysToDeliver, ChronoUnit.DAYS);

            String newShipOnDate = df.format(newShipDts);
            String newDeliveryDate = df.format(newDeliverDts);

            System.out.println(order.getOrderId() + ": ShipOn " + shipOnDate + " => " + newShipOnDate + ", Delivery " + deliveryDate + " => " + newDeliveryDate);

            order.getShipping().setShipOnDate(newShipOnDate);
            order.getShipping().setDeliveryDate(newDeliveryDate);
            orderApi.updateOrder(order, order.getOrderId(), expand);
            Thread.sleep(200); // sleep 1/2 second to avoid tripping rate limiter.
            
        }

        System.exit(0);

    }


    private static List<Order> getOrdersInShipping(OrderApi api, int offset, int limit) throws ApiException {

        String sort = null;

        OrderQuery orderQuery = new OrderQuery();
        orderQuery.setCurrentStage(OrderQuery.CurrentStageEnum.SHIPPING_DEPARTMENT);

        OrdersResponse response = api.getOrdersByQuery(orderQuery, limit, offset, sort, expand);
        if (response.isSuccess()) {
            return response.getOrders();
        }

        return new ArrayList<Order>();
    }


}
