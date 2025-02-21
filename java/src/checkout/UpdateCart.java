package checkout;

import com.ultracart.admin.v2.CheckoutApi;
import com.ultracart.admin.v2.models.Cart;
import com.ultracart.admin.v2.models.CartItem;
import com.ultracart.admin.v2.models.CartItemOption;
import com.ultracart.admin.v2.models.CartResponse;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class UpdateCart {
    public static void execute() {
        // Reference Implementation: https://github.com/UltraCart/responsive_checkout

        // this example uses the getCart method as a starting point, because we must get a cart to update a cart.
        // this example is the same for both getCart and getCartByCartId. They work as a pair and are called
        // depending on the presence of an existing cart id or not. For new carts, getCart() is used. 
        // For existing carts, getCartByCartId(cart_id) is used.

        try {
            CheckoutApi checkoutApi = new CheckoutApi(Constants.API_KEY);

            String expansion = "items"; // for this example, we're just getting a cart to insert some items into it.

            // In Java web applications, you'd retrieve the cookie from the HttpServletRequest
            String cartId = null;
            // Example of how you might retrieve a cookie in a Servlet:
            // Cookie[] cookies = request.getCookies();
            // if (cookies != null) {
            //     for (Cookie cookie : cookies) {
            //         if (Constants.CART_ID_COOKIE_NAME.equals(cookie.getName())) {
            //             cartId = cookie.getValue();
            //             break;
            //         }
            //     }
            // }

            Cart cart;
            if (cartId == null) {
                CartResponse apiResponse = checkoutApi.getCart(expansion);
                cart = apiResponse.getCart();
            } else {
                CartResponse apiResponse = checkoutApi.getCartByCartId(cartId, expansion);
                cart = apiResponse.getCart();
            }

            // for this simple example, items will be added to the cart. so our expansion variable is simply 'items' above.
            // Get the items array on the cart, creating it if it doesn't exist.
            List<CartItem> items = cart.getItems();
            // If null, go ahead and initialize it to an empty list
            if (items == null) {
                items = new ArrayList<>();
            }

            // Create a new item
            CartItem item = new CartItem();
            item.setItemId("BASEBALL"); // TODO: Adjust the item id
            item.setQuantity(BigDecimal.valueOf(1)); // TODO: Adjust the quantity

            // TODO: If your item has options then you need to create a new CartItemOption object and add it to the list.
            List<CartItemOption> options = new ArrayList<>();
            item.setOptions(options);

            // Add the item to the items list
            items.add(item);

            // Make sure to update the cart with the new list
            cart.setItems(items);

            // Push the cart up to save the item
            CartResponse cartResponse = checkoutApi.updateCart(cart, expansion);

            // Extract the updated cart from the response
            cart = cartResponse.getCart();

            // TODO: set or re-set the cart cookie if this is part of a multi-page process. two weeks is a generous cart id time.
            // Example of how you might set a cookie in a Servlet:
            // Cookie cookie = new Cookie(Constants.CART_ID_COOKIE_NAME, cart.getCartId());
            // cookie.setMaxAge(14 * 24 * 60 * 60); // 2 weeks in seconds
            // cookie.setPath("/");
            // response.addCookie(cookie);

            System.out.println(cart.toString());

        } catch (ApiException e) {
            e.printStackTrace();
        }
    }
}