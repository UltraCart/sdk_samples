package order;

import com.ultracart.admin.v2.OrderApi;
import com.ultracart.admin.v2.models.*;
import com.ultracart.admin.v2.util.ApiException;

public class UpdateOrder {
   public static void execute() throws ApiException {
       OrderApi orderApi = new OrderApi(common.Constants.API_KEY);

       String expansion = "checkout"; // see the getOrder sample for expansion discussion

       String orderId = "DEMO-0009104976";
       Order order = orderApi.getOrder(orderId, expansion).getOrder();

       System.out.println("Original Order follows:");
       System.out.println(order.toString());

       // TODO: do some updates to the order.
       // For example:
       // order.getBillingAddress().setFirstName("John");
       // order.getBillingAddress().setLastName("Smith");

       OrderResponse apiResponse = orderApi.updateOrder(orderId, order, expansion);

       if (apiResponse.getError() != null) {
           System.err.println(apiResponse.getError().getDeveloperMessage());
           System.err.println(apiResponse.getError().getUserMessage());
           return;
       }

       Order updatedOrder = apiResponse.getOrder();

       System.out.println("Updated Order follows:");
       System.out.println(updatedOrder.toString());
   }
}