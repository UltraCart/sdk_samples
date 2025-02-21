package order;

import com.ultracart.admin.v2.OrderApi;
import com.ultracart.admin.v2.models.*;
import com.ultracart.admin.v2.util.ApiException;

/*
* OrderApi.resendReceipt() will resend (email) a receipt to a customer.
*/
public class ResendReceipt {
   public static void execute() throws ApiException {
       OrderApi orderApi = new OrderApi(common.Constants.API_KEY);

       String orderId = "DEMO-0009104436";

       BaseResponse apiResponse = orderApi.resendReceipt(orderId);

       if (apiResponse.getError() != null) {
           System.err.println(apiResponse.getError().getDeveloperMessage());
           System.err.println(apiResponse.getError().getUserMessage());
           System.out.println("Order receipt could not be resent. See error log.");
           return;
       }

       if (apiResponse.getSuccess()) {
           System.out.println("Receipt was resent.");
       } else {
           System.out.println("Failed to resend receipt.");
       }
   }
}