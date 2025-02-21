package checkout;

import com.ultracart.admin.v2.CheckoutApi;
import com.ultracart.admin.v2.models.*;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class RelatedItemsForItem {
    public static void execute() {
        // Reference Implementation: https://github.com/UltraCart/responsive_checkout

        // Retrieves items related to the items within the cart, in addition to another item id you supply.
        // Item relations are configured in the UltraCart backend.
        // See: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377171/Related+Items

        // Note: The returned items have a fixed expansion (only so many item properties are returned). The item expansion is:
        // content, content.assignments, content.attributes, content.multimedia, content.multimedia.thumbnails, options, pricing, and pricing.tiers

        CheckoutApi checkoutApi = new CheckoutApi(Constants.API_KEY);

        String expansion = "customer_profile,items,billing,shipping,coupons,checkout,payment,summary,taxes";
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

        // In Java web application, you'd get the cookie from HttpServletRequest
        String cartId = null;
        // Example of how you might get the cookie in a Servlet
        // Cookie[] cookies = request.getCookies();
        // if (cookies != null) {
        //     for (Cookie cookie : cookies) {
        //         if (Constants.CART_ID_COOKIE_NAME.equals(cookie.getName())) {
        //             cartId = cookie.getValue();
        //             break;
        //         }
        //     }
        // }

        try {
            Cart cart;
            if (cartId == null) {
                CartResponse apiResponse = checkoutApi.getCart(expansion);
                cart = apiResponse.getCart();
            } else {
                CartResponse apiResponse = checkoutApi.getCartByCartId(cartId, expansion);
                cart = apiResponse.getCart();
            }

            // TODO - add some items to the cart and update.

            List<CartItem> items = new ArrayList<>();
            CartItem cartItem = new CartItem();
            cartItem.setItemId("ITEM_ABC");
            cartItem.setQuantity(BigDecimal.valueOf(1));
            items.add(cartItem);
            cart.setItems(items);

            // update the cart and assign it back to our variable.
            cart = checkoutApi.updateCart(cart, expansion).getCart();

            String anotherItemId = "ITEM_ZZZ";

            ItemsResponse apiResponse2 = checkoutApi.relatedItemsForItem(anotherItemId, cart, expansion);
            List<Item> relatedItems = apiResponse2.getItems();

            System.out.println("<html lang=\"en\"><body><pre>");
            for (Item item : relatedItems) {
                System.out.println(item.toString());
            }
            System.out.println("</pre></body></html>");

        } catch (ApiException e) {
            e.printStackTrace();
        }
    }
}