package order;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.ultracart.admin.v2.OrderApi;
import com.ultracart.admin.v2.models.*;
import com.ultracart.admin.v2.util.ApiException;

public class AssignRma {
   /*
       OrderApi.assignRma() assigns an RMA (return merchandise authorization) number to an order.

       The rma value is required, is trimmed, and may be at most 30 characters.  Any RMA already on the
       order is replaced, and a merchant note is added to the order recording the change.

       The optional expansion parameter controls how much of the updated order is returned.
       Requires the order_write scope.

       Note: getOrdersByRma is backed by a search index, so a freshly assigned RMA may take a short time
       before it can be found with that call.
    */
   public static void execute() throws ApiException {
       OrderApi orderApi = new OrderApi(common.Constants.API_KEY);

       String orderId = "DEMO-0009104390";
       String expansion = "item,summary,billing,shipping"; // see www.ultracart.com/api/ for all expansion fields

       OrderAssignRmaRequest rmaRequest = new OrderAssignRmaRequest();
       rmaRequest.setRma("RMA-12345");

       OrderResponse apiResponse = orderApi.assignRma(orderId, rmaRequest, expansion);

       if (apiResponse.getError() != null) {
           System.err.println(apiResponse.getError().getDeveloperMessage());
           System.err.println(apiResponse.getError().getUserMessage());
           System.exit(1);
       }

       Order order = apiResponse.getOrder();
       Gson gson = new GsonBuilder().setPrettyPrinting().create();
       System.out.println(gson.toJson(order));
   }
}
