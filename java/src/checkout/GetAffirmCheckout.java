package checkout;

import com.ultracart.admin.v2.CheckoutApi;
import com.ultracart.admin.v2.models.CartAffirmCheckoutResponse;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

public class GetAffirmCheckout {
    /**
     * Returns Affirm checkout JSON for a given cart ID
     * Reference Implementation: https://github.com/UltraCart/responsive_checkout
     * See https://www.affirm.com/ for Affirm details
     */
    public static void execute() {
        CheckoutApi checkoutApi = new CheckoutApi(Constants.API_KEY);
        String cartId = "123456789123456789123456789123456789"; // retrieve from session or cookie

        try {
            CartAffirmCheckoutResponse apiResponse = checkoutApi.getAffirmCheckout(cartId);
            
            if (apiResponse.getErrors() != null && !apiResponse.getErrors().isEmpty()) {
                // Display errors to customer about the failure
                for (String error : apiResponse.getErrors()) {
                    System.out.println(error);
                }
            } else {
                System.out.println(apiResponse.getCheckoutJson()); // object to send to Affirm
            }
        } catch (ApiException e) {
            e.printStackTrace();
        }
    }
}