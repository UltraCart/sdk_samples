package order;

import com.ultracart.admin.v2.OrderApi;
import com.ultracart.admin.v2.models.*;
import com.ultracart.admin.v2.util.ApiException;

/*
* OrderApi.resendShipmentConfirmation() will resend (email) a shipment confirmation to a customer.
*/
public class ResendShipmentConfirmation {
   public static void execute() throws ApiException {
       OrderApi orderApi = new OrderApi(common.Constants.API_KEY);

       String orderId = "DEMO-0009104436";

       BaseResponse apiResponse = orderApi.resendShipmentConfirmation(orderId);

       if (apiResponse.getError() != null) {
           System.err.println(apiResponse.getError().getDeveloperMessage());
           System.err.println(apiResponse.getError().getUserMessage());
           System.out.println("Order could not be adjusted. See error log.");
           return;
       }

       if (apiResponse.getSuccess()) {
           System.out.println("Shipment confirmation was resent.");
       } else {
           System.out.println("Failed to resend shipment confirmation.");
       }
   }
}