package order;

import com.ultracart.admin.v2.OrderApi;
import com.ultracart.admin.v2.models.*;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

public class CancelOrder {
   /**
    * OrderApi.cancelOrder() will do just that.  It will cancel an order by rejecting it.
    * However, the following restrictions apply:
    * 1) If the order is already completed, this call will fail.
    * 2) If the order has already been rejected, this call will fail.
    * 3) If the order has already been transmitted to a fulfillment center, this call will fail.
    * 4) If the order is queued for transmission to a distribution center, this call will fail.
    */
   public static void execute() throws ApiException {
       OrderApi orderApi = new OrderApi(Constants.API_KEY);

       String orderId = "DEMO-0009104390";
       BaseResponse apiResponse = orderApi.cancelOrder(orderId, false, false);

       if (apiResponse.getError() != null) {
           System.err.println(apiResponse.getError().getDeveloperMessage());
           System.err.println(apiResponse.getError().getUserMessage());
           System.out.println("Order could not be canceled. See error log.");
           return;
       }

       if (apiResponse.getSuccess()) {
           System.out.println("Order was canceled successfully.");
       }
   }
}