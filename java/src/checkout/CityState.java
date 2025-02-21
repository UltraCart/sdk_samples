package checkout;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import com.ultracart.admin.v2.CheckoutApi;
import com.ultracart.admin.v2.models.*;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

public class CityState {
    /**
     * Takes a postal code and returns back a city and state (US Only)
     * Reference Implementation: https://github.com/UltraCart/responsive_checkout
     */
    public static void execute() {
        CheckoutApi checkoutApi = new CheckoutApi(Constants.API_KEY);

        String cartId = "123456789123456789123456789123456789";  // you should have the cart id from session or cookie.
        Cart cart = new Cart();
        cart.cartId(cartId); // required
        cart.shipping(new CartShipping());
        cart.getShipping().postalCode("44233");

        try {
            CityStateZip apiResponse = checkoutApi.cityState(cart);
            System.out.println("City: " + apiResponse.getCity());
            System.out.println("State: " + apiResponse.getState());
        } catch (ApiException e) {
            e.printStackTrace();
        }
    }
}