package order;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.ultracart.admin.v2.OrderApi;
import com.ultracart.admin.v2.models.*;
import com.ultracart.admin.v2.util.ApiException;
import java.util.List;

public class GetOrdersByRma {
   /*
       OrderApi.getOrdersByRma() returns all orders that carry a given RMA number.

       The match is exact only.  Wildcards such as * are rejected with a 400 error.
       More than one order may share the same RMA, so a list of orders is returned.

       The lookup is backed by a search index, so an RMA that was just assigned with assignRma may take
       a short time before it appears here.

       The REST endpoint also accepts _limit (max 1000), _offset and _sort, but the Java SDK method only
       exposes the rma and the optional expansion parameter.
       Requires the order_read scope.
    */
   public static void execute() throws ApiException {
       OrderApi orderApi = new OrderApi(common.Constants.API_KEY);

       String rma = "RMA-12345";
       String expansion = "item,summary,billing,shipping"; // see www.ultracart.com/api/ for all expansion fields

       OrdersResponse apiResponse = orderApi.getOrdersByRma(rma, expansion);

       if (apiResponse.getError() != null) {
           System.err.println(apiResponse.getError().getDeveloperMessage());
           System.err.println(apiResponse.getError().getUserMessage());
           System.exit(1);
       }

       List<Order> orders = apiResponse.getOrders();
       if (orders == null || orders.isEmpty()) {
           System.out.println("No orders found for this RMA.");
           return;
       }

       Gson gson = new GsonBuilder().setPrettyPrinting().create();
       for (Order order : orders) {
           System.out.println(gson.toJson(order));
       }
   }
}
