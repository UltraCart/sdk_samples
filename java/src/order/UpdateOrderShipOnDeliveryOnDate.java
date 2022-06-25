

package order;

import com.sun.istack.internal.Nullable;
import com.ultracart.admin.v2.OrderApi;
import com.ultracart.admin.v2.models.Order;
import com.ultracart.admin.v2.models.OrderItem;
import com.ultracart.admin.v2.models.OrderResponse;
import com.ultracart.admin.v2.util.ApiException;
import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormatter;
import org.joda.time.format.ISODateTimeFormat;

import java.sql.Timestamp;

public class UpdateOrderShipOnDeliveryOnDate {

  public static void main(String[] args) throws ApiException {

    // Create a Simple Key: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/38688545/API+Simple+Key
    final String apiKey = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX8a00748a25aa28dbXXXXXXXXXXXXXXXXXXXX";

    OrderApi orderApi = new OrderApi(apiKey);

    String[] orderIds = new String[]{
//        "DEMO-1024250",
//        "DEMO-1024249",
//        "DEMO-1024248",
//        "DEMO-1024209",
//        "DEMO-1024183",
//        "DEMO-1024176",
//        "DEMO-1024133",
//        "DEMO-1024509",
//        "DEMO-1024527",
//        "DEMO-1024594",
//        "DEMO-1024536",
//        "DEMO-1024604",
//        "DEMO-1024603",
//        "DEMO-1024650",
//        "DEMO-1024475",
//        "DEMO-1024505",
//        "DEMO-1024463",
//        "DEMO-1024424",
//        "DEMO-1024442",
//        "DEMO-1024434",
//        "DEMO-1024410",
//        "DEMO-1024323",
//        "DEMO-1024318",
//        "DEMO-1024311",
//        "DEMO-1024310",
//        "DEMO-1024300",
//        "DEMO-1024281",
//        "DEMO-1024280",
//        "DEMO-1024403",
//        "DEMO-1024290",
//        "DEMO-1024357",
//        "DEMO-1024354",
//        "DEMO-1024345",
//        "DEMO-1024330",
//        "DEMO-1024326",
//        "DEMO-1024625",
//        "DEMO-1024506",
//        "DEMO-1024626",
//        "DEMO-1024652",
//        "DEMO-1024646",
//        "DEMO-1024638",
//        "DEMO-1024671",
//        "DEMO-1024637",
//        "DEMO-1024589",
//        "DEMO-1024632",
//        "DEMO-1024529",
//        "DEMO-1024525",
//        "DEMO-1024512",
//        "DEMO-1024493",
//        "DEMO-1023302",
//        "DEMO-1024149",
//        "DEMO-1024666",
//        "DEMO-1024679",
//        "DEMO-1024476",
//        "DEMO-1024422",
//        "DEMO-1027707",
//        "DEMO-1024388",
//        "DEMO-1024335",
//        "DEMO-1024305",
        "DEMO-1024261"
    };


    for (String orderId : orderIds) {
      OrderResponse orderResponse = orderApi.getOrder(orderId, "shipping,item");

      if (orderResponse != null && orderResponse.getOrder() != null) {
        Order order = orderResponse.getOrder();
        System.out.println(order.getOrderId() + " is located in stage: " + order.getCurrentStage().toString());

        for (OrderItem item : order.getItems()) {
          System.out.println("  Item: " + item.getMerchantItemId() + " shipped " + item.getShippedDts());
          System.out.println("  Item: " + item.getMerchantItemId() + " packed by user " + item.getPackedByUser());
          System.out.println("  Item: " + item.getMerchantItemId() + " transmitted " + item.getTransmittedToDistributionCenterDts());
        }

        System.out.println(order.getShipping().getShipOnDate());
        System.out.println(order.getShipping().getDeliveryDate());
      }

      // advance the ship on date by 1 day.
      // advance the delivered by date by 1 day.

    }

  }

  @Nullable
  public static Timestamp parseISO8601(@Nullable String dateString) {
    if (dateString == null) return null;
    Timestamp result = null;
    // Try no millis first as this is what we typically output
    try {
      DateTimeFormatter fmt = ISODateTimeFormat.dateTimeNoMillis();
      DateTime dt = fmt.parseDateTime(dateString);
      if (dt != null) {
        result = new Timestamp(dt.getMillis());
      }
    } catch (Exception ignored) {
      // if they don't have the right format, they get null.
    }
    if (result != null) return result;

    // Also support the millis format since moment.js will output that.
    try {
      DateTimeFormatter fmt = ISODateTimeFormat.dateTime();
      DateTime dt = fmt.parseDateTime(dateString);
      if (dt != null) {
        result = new Timestamp(dt.getMillis());
      }
    } catch (Exception ignored) {
      // if they don't have the right format, they get null.
    }
    return result;
  }

}
