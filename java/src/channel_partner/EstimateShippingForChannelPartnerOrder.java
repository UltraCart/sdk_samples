package channel_partner;

import com.ultracart.admin.v2.ChannelPartnerApi;
import com.ultracart.admin.v2.models.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class EstimateShippingForChannelPartnerOrder {
  /*
   This is a helper function for call centers to calculate the shipping cost on an order.  In a typical flow, the call center
   will collect all the shipping information and items being purchased into a ChannelPartnerOrder object.
   They will then call this method, passing in the order object.  The response will contain the shipping estimates
   that the call center can present to the customer.  Once the customer selects a particulate estimate,
   they can then plug that cost into their call center application and complete the order.

   Possible Errors:
   Using an API key that is not tied to a channel partner: "This API Key does not have permission to interact with channel partner orders.  Please review your Channel Partner configuration."
   Order has invalid channel partner code: "Invalid channel partner code"
   Order has no items: "null order.items passed." or "order.items array contains a null entry."
   Order has no channel partner order id: "order.channelPartnerOrderId must be specified."
   Order channel partner order id is a duplicate:  "order.channelPartnerOrderId [XYZ] already used."
   Channel Partner is inactive: "partner is inactive."
  */
  public static void execute() {
    System.out.println("--- EstimateShippingForChannelPartnerOrder ---");

    try {
      // Create channel partner API instance using API key
      ChannelPartnerApi channelPartnerApi = new ChannelPartnerApi(common.Constants.CHANNEL_PARTNER_API_KEY);

      ChannelPartnerOrder order = new ChannelPartnerOrder();
      order.setChannelPartnerOrderId("widget-1245-abc-1");

      ArrayList<String> coupons = new ArrayList<String>();
      coupons.add("10OFF");
      order.setCoupons(coupons);

      // DeliveryDate will impact shipping estimates if there is a delivery deadline.
      // order.setDeliveryDate(Instant.now().plus(14, java.time.temporal.ChronoUnit.DAYS).toString());

      ArrayList<ChannelPartnerOrderItem> items = new ArrayList<ChannelPartnerOrderItem>();
      ChannelPartnerOrderItem item = new ChannelPartnerOrderItem();
      // item.setArbitraryUnitCost(new java.math.BigDecimal("9.99"));
      // item.setAutoOrderLastRebillDts(Instant.now().minus(30, java.time.temporal.ChronoUnit.DAYS).toString());
      // item.setAutoOrderSchedule("Weekly");
      item.setMerchantItemId("shirt");

      ArrayList<ChannelPartnerOrderItemOption> options = new ArrayList<ChannelPartnerOrderItemOption>();
      ChannelPartnerOrderItemOption sizeOption = new ChannelPartnerOrderItemOption();
      sizeOption.setName("Size");
      sizeOption.setValue("Small");
      options.add(sizeOption);

      ChannelPartnerOrderItemOption colorOption = new ChannelPartnerOrderItemOption();
      colorOption.setName("Color");
      colorOption.setValue("Orange");
      options.add(colorOption);

      item.setOptions(options);
      item.setQuantity(BigDecimal.valueOf(1));
      item.setUpsell(false);
      items.add(item);
      order.setItems(items);

      // order.setShipOnDate(Instant.now().plus(7, java.time.temporal.ChronoUnit.DAYS).toString());
      order.setShipToResidential(true);
      order.setShiptoAddress1("55 Main Street");
      order.setShiptoAddress2("Suite 202");
      order.setShiptoCity("Duluth");
      order.setShiptoCompany("Widgets Inc");
      order.setShiptoCountryCode("US");
      order.setShiptoDayPhone("6785552323");
      order.setShiptoEveningPhone("7703334444");
      order.setShiptoFirstName("Sally");
      order.setShiptoLastName("McGonkyDee");
      order.setShiptoPostalCode("30097");
      order.setShiptoStateRegion("GA");
      order.setShiptoTitle("Director");

      ChannelPartnerEstimateShippingResponse apiResponse = channelPartnerApi.estimateShippingForChannelPartnerOrder(order);
      List<ChannelPartnerShippingEstimate> estimates = apiResponse.getEstimates();

      // TODO: Apply one estimate shipping method (name) and cost to your channel partner order.

      // Display shipping estimates
      for (ChannelPartnerShippingEstimate estimate : estimates) {
        System.out.println(estimate);
      }

      System.out.println("Retrieved " + estimates.size() + " shipping estimates");
    } catch (Exception ex) {
      System.out.println("Error: " + ex.getMessage());
      ex.printStackTrace();
    }
  }
}