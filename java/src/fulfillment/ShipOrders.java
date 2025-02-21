package fulfillment;

import java.math.BigDecimal;
import java.util.List;
import java.util.ArrayList;

import com.ultracart.admin.v2.FulfillmentApi;
import com.ultracart.admin.v2.models.FulfillmentShipment;
import com.ultracart.admin.v2.util.ApiException;

import common.Constants;

public class ShipOrders {
    /*
        shipOrders informs UltraCart that you (the fulfillment center) have shipped an order and allows you to provide
        UltraCart with tracking information.

        You will need the distribution center (DC) code.  UltraCart allows for multiple DC and the code is a
        unique short string you assign to a DC as an easy mnemonic.

        For more information about UltraCart distribution centers, please see:
        https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377114/Distribution+Center

        If you do not know your DC code, query a list of all DC and print them out.
        DistributionCentersResponse result = fulfillmentApi.getDistributionCenters();
        System.out.println(result);

        A successful call will receive back a status code 204 (No Content).

        Possible Errors:
        More than 100 order ids provided -> "shipments can not contain more than 100 records at a time"
    */

    public static void execute() {
        String distributionCenterCode = "RAMI";
        FulfillmentApi fulfillmentApi = new FulfillmentApi(Constants.API_KEY);

        FulfillmentShipment shipment = new FulfillmentShipment();
        shipment.setOrderId("DEMO-12345");
        
        List<String> trackingNumbers = new ArrayList<>();
        trackingNumbers.add("UPS-1234567890");
        trackingNumbers.add("USPS-BLAH-BLAH-BLAH");
        shipment.setTrackingNumbers(trackingNumbers); // this order had two boxes.
        
        shipment.setShippingCost(new BigDecimal("16.99")); // the actual cost to ship this order
        shipment.setFulfillmentFee(new BigDecimal("8.99")); // this fulfillment center is kinda pricey.
        shipment.setPackageCost(new BigDecimal("11.99")); // 11.99?  we use only the finest packaging.

        List<FulfillmentShipment> shipments = new ArrayList<>();
        shipments.add(shipment); // up to 100 shipments per call

        try {
            // limit is 100 shipments updates at a time.
            fulfillmentApi.shipOrders(distributionCenterCode, shipments);
            System.out.println("done");
        } catch (Exception e) {
            // update inventory failed.  examine the reason.
            System.out.println("Exception when calling FulfillmentApi.shipOrders: " + e.getMessage());
            System.exit(1);
        }
    }
}