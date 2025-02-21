package order;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.ultracart.admin.v2.OrderApi;
import com.ultracart.admin.v2.models.*;
import com.ultracart.admin.v2.util.ApiException;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class GetOrders {
   /*
    * getOrders was the first order query provided by UltraCart. It still functions well, but it is extremely verbose
    * because the query call takes a variable for every possible filter. You are advised to get getOrdersByQuery().
    * It is easier to use and will result in less code. Still, we provide an example here to be thorough.
    *
    * For this email, we will query all orders for a particular email address. The getOrdersByQuery() example
    * illustrates using a date range to filter and select orders.
    */
   public void execute() throws ApiException {
       OrderApi orderApi = new OrderApi(common.Constants.API_KEY);

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

       // this could get verbose...
       Gson gson = new GsonBuilder().setPrettyPrinting().create();
       for (Order order : orders) {
           System.out.println(gson.toJson(order));
       }
       
       System.out.println("<html lang=\"en\"><body><pre>");
       System.out.println(orders);
       System.out.println("</pre></body></html>");
   }

   private List<Order> getOrderChunk(OrderApi orderApi, int offset, int limit) throws ApiException {
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

       String orderId = null;
       String paymentMethod = null;
       String company = null;
       String firstName = null;
       String lastName = null;
       String city = null;
       String stateRegion = null;
       String postalCode = null;
       String countryCode = null;
       String phone = null;
       String email = "support@ultracart.com"; // <-- this is the only filter we're using.
       String ccEmail = null;
       BigDecimal total = null;
       String screenBrandingThemeCode = null;
       String storefrontHostName = null;
       String creationDateBegin = null;
       String creationDateEnd = null;
       String paymentDateBegin = null;
       String paymentDateEnd = null;
       String shipmentDateBegin = null;
       String shipmentDateEnd = null;
       String rma = null;
       String purchaseOrderNumber = null;
       String itemId = null;
       String currentStage = null;
       String channelPartnerCode = null;
       String channelPartnerOrderId = null;
       String sort = null;

       // see all these parameters? that is why you should use getOrdersByQuery() instead of getOrders()
       OrdersResponse apiResponse = orderApi.getOrders(orderId, paymentMethod, company, firstName, lastName, city,
           stateRegion, postalCode, countryCode, phone, email, ccEmail, total, screenBrandingThemeCode,
           storefrontHostName, creationDateBegin, creationDateEnd, paymentDateBegin, paymentDateEnd,
           shipmentDateBegin, shipmentDateEnd, rma, purchaseOrderNumber, itemId, currentStage,
           channelPartnerCode, channelPartnerOrderId, limit, offset, sort, expansion);

       if (apiResponse.getOrders() != null) {
           return apiResponse.getOrders();
       }
       return new ArrayList<>();
   }
}