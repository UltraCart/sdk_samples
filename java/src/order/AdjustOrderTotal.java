package order;

import com.ultracart.admin.v2.OrderApi;
import com.ultracart.admin.v2.models.*;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

public class AdjustOrderTotal {
   /**
    * OrderApi.adjustOrderTotal() takes a desired order total and performs goal-seeking to adjust all items and taxes
    * appropriately.  This method was created for merchants dealing with Medicare and Medicaid.  When selling their
    * medical devices, they would often run into limits approved by Medicare.  As such, they needed to adjust the
    * order total to match the approved amount.  This is a convenience method to adjust individual items and their
    * taxes to match the desired total.
    */
   public static void execute() throws ApiException {
       OrderApi orderApi = new OrderApi(Constants.API_KEY);

       String orderId = "DEMO-0009104390";
       String desiredTotal = "21.99";
       BaseResponse apiResponse = orderApi.adjustOrderTotal(orderId, desiredTotal);

       if (apiResponse.getError() != null) {
           System.err.println(apiResponse.getError().getDeveloperMessage());
           System.err.println(apiResponse.getError().getUserMessage());
           System.out.println("Order could not be adjusted. See error log.");
           return;
       }

       if (apiResponse.getSuccess()) {
           System.out.println("Order was adjusted successfully. Use getOrder() to retrieve the order if needed.");
       }
   }
}