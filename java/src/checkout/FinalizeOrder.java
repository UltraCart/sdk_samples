package checkout;

import com.ultracart.admin.v2.CheckoutApi;
import com.ultracart.admin.v2.models.*;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class FinalizeOrder {
    /**
     * Finalizes an order from a cart
     * Reference Implementation: https://github.com/UltraCart/responsive_checkout
     * 
     * Note: You probably should NOT be using this method. Use handoffCart() instead.
     * This method is a server-side only (no browser key allowed) method for turning a cart into an order.
     * It exists for merchants who wish to provide their own upsells, but using this method
     * will exclude the customer checkout from a vast and powerful suite of functionality provided free by UltraCart.
     */
    public static void execute() {
        CheckoutApi checkoutApi = new CheckoutApi(Constants.API_KEY);

        // Possible Expansion Variables documented at https://www.ultracart.com/api/#resource_checkout.html
        String expansion = "customer_profile,items,billing,shipping,coupons,checkout,payment,summary,taxes";

        String cartId = "123456789123456789123456789123456789"; // get the cart id from session or cookie

        try {
            CartResponse cartResponse = checkoutApi.getCartByCartId(cartId, expansion);
            Cart cart = cartResponse.getCart();

            // TODO - add some items, collect billing and shipping, use hosted fields to collect payment, etc.

            CartFinalizeOrderRequest finalizeRequest = new CartFinalizeOrderRequest();
            finalizeRequest.cart(cart);
            CartFinalizeOrderRequestOptions finalizeOptions = new CartFinalizeOrderRequestOptions();
            finalizeRequest.options(finalizeOptions);

            CartFinalizeOrderResponse orderResponse = checkoutApi.finalizeOrder(finalizeRequest);
            // orderResponse.isSuccessful();
            // orderResponse.getErrors();
            // orderResponse.getOrderId();
            // orderResponse.getOrder();

            Gson gson = new GsonBuilder().setPrettyPrinting().create();
            System.out.println(gson.toJson(orderResponse));

        } catch (ApiException e) {
            e.printStackTrace();
        }
    }
}