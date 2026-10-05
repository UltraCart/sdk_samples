package order;

import com.ultracart.admin.v2.OrderApi;
import com.ultracart.admin.v2.models.*;
import com.ultracart.admin.v2.util.ApiException;

public class GetUpdateBillingUrl {
   /*
       OrderApi.getUpdateBillingUrl() returns the url a customer can use to update the billing information
       on the auto order associated with an order.  This is the same url sent in the auto order update
       billing email.

       The order must belong to an auto order, otherwise a 400 error is returned.  Either the original
       order or any rebill order of the auto order may be used.

       Requires the order_write scope because the url carries a customer access token.
    */
   public static void execute() throws ApiException {
       OrderApi orderApi = new OrderApi(common.Constants.API_KEY);

       String orderId = "DEMO-0009104390";
       OrderAutoOrderUpdateBillingUrlResponse apiResponse = orderApi.getUpdateBillingUrl(orderId);

       if (apiResponse.getError() != null) {
           System.err.println(apiResponse.getError().getDeveloperMessage());
           System.err.println(apiResponse.getError().getUserMessage());
           System.exit(1);
       }

       // WARNING: this url grants access to the customer's billing information.  Do not log it or expose it
       // publicly in production.  It is printed here only for demonstration.
       System.out.println(apiResponse.getUpdateBillingUrl());
   }
}
