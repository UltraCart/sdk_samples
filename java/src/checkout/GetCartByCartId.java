package checkout;

import com.ultracart.admin.v2.CheckoutApi;
import com.ultracart.admin.v2.models.*;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class GetCartByCartId {
    /**
     * Retrieves a cart either by creating a new one or getting an existing one by cart ID
     * Reference Implementation: https://github.com/UltraCart/responsive_checkout
     *
     * This example is the same for both getCart.php and getCartByCartId.php.  They work as a pair and are called
     * depending on the presence of an existing cart id or not.  For new carts, getCart() is used.  For existing
     * carts, getCartByCartId($cart_id) is used.
     */
    public static void execute() {
        CheckoutApi checkoutApi = new CheckoutApi(Constants.API_KEY);

        // for this example, we're just getting a cart to insert some items into it.
        String expansion = "items";

        try {
            // get cart ID from session or cookie.
            String cartId = "123456780123456780123456780123456780";
            CartResponse apiResponse = checkoutApi.getCartByCartId(cartId, expansion);
            Cart cart = apiResponse.getCart();

            // TODO: set or re-set the cart cookie if this is part of a multi-page process. two weeks is a generous cart id time.
            // Note: In Java, cookie handling is framework-specific. The following is a conceptual representation.
            // HttpCookie cookie = new HttpCookie(Constants.CART_ID_COOKIE_NAME);
            // cookie.setValue(cart.getCartId());
            // cookie.setMaxAge(1209600); // 1209600 seconds = 14 days
            // cookie.setPath("/");
            // HttpContext.getCurrentResponse().addCookie(cookie);

            Gson gson = new GsonBuilder().setPrettyPrinting().create();
            System.out.println(gson.toJson(cart));

        } catch (ApiException e) {
            e.printStackTrace();
        }
    }
}