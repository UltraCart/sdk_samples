package order;

import com.ultracart.admin.v2.OrderApi;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

public class DeleteOrder {
   /**
    * OrderApi.deleteOrder() will do just that.  It will delete an order.
    * You might find it more useful to reject an order rather than delete it in order to leave an audit trail.
    * However, deleting test orders will be useful to keep your order history tidy.  Still, any order
    * may be deleted.
    */
   public static void execute() throws ApiException {
       OrderApi orderApi = new OrderApi(Constants.API_KEY);

       String orderId = "DEMO-0008104390";
       orderApi.deleteOrder(orderId);
       System.out.println("Order was deleted successfully.");
   }
}