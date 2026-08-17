package order;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.ultracart.admin.v2.OrderApi;
import com.ultracart.admin.v2.models.*;
import com.ultracart.admin.v2.util.ApiException;
import java.util.List;

public class GetOrderEmails {
   /*
       getOrderEmails returns the delivery records for every email UltraCart sent regarding an order,
       oldest first.  Each record carries the subject and send time plus delivery, open, click and bounce
       status, which makes this useful evidence that a customer was notified about their order.

       A customer profile is NOT required.  These records are tied to the order id itself.

       An order with no email history, or one whose emails were all suppressed, comes back with an empty
       list.  That is a successful response rather than an error.

       The getInternal() flag marks messages sent to merchant staff rather than to the customer.  Filter
       those out if you only want what the customer actually received.

       Possible Errors:
       order_id does not start with the merchant id -> "Path parameter 'order_id' does not start with the merchant id.  Check your parameter value and call log."
    */
   public void execute() throws ApiException {
       OrderApi orderApi = new OrderApi(common.Constants.API_KEY);

       String orderId = "DEMO-0009104976";
       OrderEmailsResponse response = orderApi.getOrderEmails(orderId);
       List<OrderEmail> emails = response.getEmails();

       if (emails == null || emails.isEmpty()) {
           System.out.println("No emails were sent for this order.");
           return;
       }

       Gson gson = new GsonBuilder().setPrettyPrinting().create();
       for (OrderEmail email : emails) {
           System.out.println(gson.toJson(email));
       }
   }
}
