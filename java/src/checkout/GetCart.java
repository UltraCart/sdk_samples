package checkout;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import com.ultracart.admin.v2.CheckoutApi;
import com.ultracart.admin.v2.models.*;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class GetCart {
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

        // Possible Expansion Variables: (see https://www.ultracart.com/api/#resource_checkout.html
        /*
        affiliate                   checkout                            customer_profile
        billing                     coupons                             gift
        gift_certificate            items.attributes                   items.multimedia
        items                       items.multimedia.thumbnails         items.physical
        marketing                   payment                                settings.gift
        settings.billing.provinces  settings.shipping.deliver_on_date   settings.shipping.estimates
        settings.shipping.provinces settings.shipping.ship_on_date     settings.taxes
        settings.terms              shipping                           taxes
        summary                     upsell_after
         */
        String expansion = "customer_profile,items,billing,shipping,coupons,checkout,payment,summary,taxes";

        try {
            String cartId = null; // no cart id yet.  GetCart will return a new cart.
            CartResponse apiResponse = checkoutApi.getCart(expansion);
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