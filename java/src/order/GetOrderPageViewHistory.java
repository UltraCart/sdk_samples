package order;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.ultracart.admin.v2.OrderApi;
import com.ultracart.admin.v2.models.*;
import com.ultracart.admin.v2.util.ApiException;
import java.util.List;

public class GetOrderPageViewHistory {
   /*
       getOrderPageViewHistory returns the page views captured during the session that placed an order,
       along with the referrer that started that session.

       A customer profile is NOT required.  These page views are keyed off an analytics client id stored
       on the order itself, so this works for guest orders.  For the email engagement side of customer
       activity, use getOrderCustomerActivity instead.

       An order placed outside the storefront, such as a phone order or an order imported from a channel
       partner, will have no analytics session attached.  In that case getPageViews() comes back empty.
       That is a successful response rather than an error.

       Note: getViewDts() is an ISO 8601 string here.  Be aware that getTs() on getOrderCustomerActivity
       is unix milliseconds instead, so do not assume the two methods format dates the same way.

       Possible Errors:
       order_id does not start with the merchant id -> "Path parameter 'order_id' does not start with the merchant id.  Check your parameter value and call log."
    */
   public void execute() throws ApiException {
       OrderApi orderApi = new OrderApi(common.Constants.API_KEY);

       String orderId = "DEMO-0009104976";
       OrderPageViewHistoryResponse response = orderApi.getOrderPageViewHistory(orderId);

       String referrer = response.getReferrer();
       System.out.println("Session referrer: " + (referrer == null ? "(none captured)" : referrer));

       List<OrderPageView> pageViews = response.getPageViews();

       if (pageViews == null || pageViews.isEmpty()) {
           System.out.println("No page views were captured for this order.");
           return;
       }

       Gson gson = new GsonBuilder().setPrettyPrinting().create();
       for (OrderPageView pageView : pageViews) {
           System.out.println(gson.toJson(pageView));
       }
   }
}
