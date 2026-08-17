package order;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.ultracart.admin.v2.OrderApi;
import com.ultracart.admin.v2.models.*;
import com.ultracart.admin.v2.util.ApiException;
import java.util.List;

public class GetOrderCustomerActivity {
   /*
       getOrderCustomerActivity returns the customer activity associated with the email address on an
       order.  This includes email engagement history, email list and segment membership, lifetime metrics
       and email suppression status.

       A customer profile is NOT required and is not consulted.  The activity is keyed off the email
       address on the order, so this works for guest orders that have never had a customer profile
       established.  For the page views captured during the session that placed the order, use
       getOrderPageViewHistory instead.

       If the order has no valid email address, email and customerActivity both come back null.  That is a
       successful response rather than an error - without an email there is no activity record to find.

       Note: activity.getTs() is a unix timestamp in milliseconds, not an ISO 8601 string like most dates
       in this API.

       Possible Errors:
       order_id does not start with the merchant id -> "Path parameter 'order_id' does not start with the merchant id.  Check your parameter value and call log."
    */
   public void execute() throws ApiException {
       OrderApi orderApi = new OrderApi(common.Constants.API_KEY);

       String orderId = "DEMO-0009104976";
       OrderCustomerActivityResponse response = orderApi.getOrderCustomerActivity(orderId);

       System.out.println("Customer activity for: " + response.getEmail());

       CustomerActivity customerActivity = response.getCustomerActivity();

       if (customerActivity == null) {
           System.out.println("No customer activity found for this order.");
           return;
       }

       System.out.println("Globally unsubscribed: " + customerActivity.getGlobalUnsubscribed());
       System.out.println("Spam complaint: " + customerActivity.getSpamComplaint());

       List<Activity> activities = customerActivity.getActivities();

       Gson gson = new GsonBuilder().setPrettyPrinting().create();
       for (Activity activity : activities) {
           System.out.println(gson.toJson(activity));
       }
   }
}
