package checkout;

import com.ultracart.admin.v2.CheckoutApi;
import com.ultracart.admin.v2.models.Cart;
import com.ultracart.admin.v2.models.CartBilling;
import com.ultracart.admin.v2.models.CartProfileLoginRequest;
import com.ultracart.admin.v2.models.CartProfileLoginResponse;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

public class Logout {
    /**
     * Logs a user OUT of the UltraCart system
     * Reference Implementation: https://github.com/UltraCart/responsive_checkout
     */
    public static void execute() throws ApiException {
        CheckoutApi checkoutApi = new CheckoutApi(Constants.API_KEY);

        // Note: customer_profile is a required expansion for login to work properly
        String expansion = "customer_profile,items,billing,shipping,coupons,checkout,payment,summary,taxes";
        // Possible Expansion Variables: (see https://www.ultracart.com/api/#resource_checkout.html

        // create a new cart (change this to an existing if you have one)
        Cart cart = checkoutApi.getCart(expansion).getCart();

        String email = "test@test.com"; // collect this from user.
        String password = "ABC123"; // collect this from user.

        cart.setBilling(new CartBilling());
        cart.getBilling().setEmail(email);

        CartProfileLoginRequest loginRequest = new CartProfileLoginRequest();
        loginRequest.setCart(cart); // will look for billing.email
        loginRequest.setPassword(password);

        CartProfileLoginResponse apiResponse = checkoutApi.login(loginRequest, null);
        cart = apiResponse.getCart();

        if (apiResponse.getErrors() != null && !apiResponse.getErrors().isEmpty()) {
            // notify customer login failed. Until they login, you can't logout.
        } else {
            checkoutApi.logout(cart, expansion); // <-- Here is the logout call.                
        }
    }
}