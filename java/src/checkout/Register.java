package checkout;

import com.ultracart.admin.v2.CheckoutApi;
import com.ultracart.admin.v2.models.Cart;
import com.ultracart.admin.v2.models.CartBilling;
import com.ultracart.admin.v2.models.CartProfileRegisterRequest;
import com.ultracart.admin.v2.models.CartProfileRegisterResponse;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

public class Register {
    /**
     * Registers a user in your merchant system. This will create a customer profile.
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
        cart.getBilling().setEmail(email); // this is the username.

        CartProfileRegisterRequest registerRequest = new CartProfileRegisterRequest();
        registerRequest.setCart(cart); // will look for billing.email
        registerRequest.setPassword(password);

        CartProfileRegisterResponse apiResponse = checkoutApi.register(registerRequest, null);
        cart = apiResponse.getCart(); // Important!  Get the cart from the response.

        if (apiResponse.getErrors() != null && !apiResponse.getErrors().isEmpty()) {
            for (String error : apiResponse.getErrors()) {
                System.out.println(error);
            }
        } else {
            System.out.println("Successfully registered new customer profile!");
        }
    }
}