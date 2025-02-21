package order;

import com.ultracart.admin.v2.OrderApi;
import com.ultracart.admin.v2.models.*;
import com.ultracart.admin.v2.util.ApiException;

public class GenerateOrderToken {
   public void execute() throws ApiException {
       /*
        * This method generates a unique encrypted key for an Order.  This is useful if you wish to provide links for
        * customer orders without allowing someone to easily cycle through orders.  By requiring order tokens, you
        * control which orders are viewable with a public hyperlink.
        *
        * This method works in tandem with OrderApi.getOrderByToken()
        */

       OrderApi orderApi = new OrderApi(common.Constants.API_KEY);

       String orderId = "DEMO-0009104436";
       OrderTokenResponse orderTokenResponse = orderApi.generateOrderToken(orderId);
       String orderToken = orderTokenResponse.getOrderToken();

       System.out.println("Order Token is: " + orderToken);

       /*
        * The token format will look something like this:
        * DEMO:UJZOGiIRLqgE3a10yp5wmEozLPNsGrDHNPiHfxsi0iAEcxgo9H74J/l6SR3X8g==
        */
   }
}