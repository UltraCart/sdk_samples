package checkout;

import com.ultracart.admin.v2.CheckoutApi;
import com.ultracart.admin.v2.models.Cart;
import com.ultracart.admin.v2.models.CartResponse;
import com.ultracart.admin.v2.models.CheckoutHandoffRequest;
import com.ultracart.admin.v2.models.CheckoutHandoffResponse;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

public class HandoffCart {
    /**
     * Hands off a cart to the UltraCart engine for further processing
     * Reference Implementation: https://github.com/UltraCart/responsive_checkout
     */
    public static void execute() throws ApiException {
        // this example uses the getCart method as a starting point, because we must get a cart to handoff a cart.
        // here, we are handing off the cart to the ultracart engine with an operation of 'view', meaning that we
        // simply added some items to the cart and wish for UltraCart to gather the remaining customer information
        // as part of a normal checkout operation.
        // valid operations are: "view", "checkout", "paypal", "paypalcredit", "affirm", "sezzle"
        // Besides "view", the other operations are finalizers.
        // "checkout": finalize the transaction using a customer's personal credit card (traditional checkout)
        // "paypal": finalize the transaction by sending the customer to PayPal

        CheckoutApi checkoutApi = new CheckoutApi(Constants.API_KEY);

        String expansion = "items"; // for this example, we're just getting a cart to insert some items into it.

        String cartId = null;
        // get the cartId from session or cookie.
        // if (HttpContext.Current.Request.Cookies[Constants.CART_ID_COOKIE_NAME] != null)
        // {
        //     cartId = HttpContext.Current.Request.Cookies[Constants.CART_ID_COOKIE_NAME].Value;
        // }

        Cart cart;
        CartResponse apiResponse;
        if (cartId == null) {
            apiResponse = checkoutApi.getCart(expansion);
        } else {
            apiResponse = checkoutApi.getCartByCartId(cartId, expansion);
        }
        cart = apiResponse.getCart();

        // Although the above code checks for a cookie and retrieves or creates a cart based on the cookie presence, typically
        // a php script calling the handoff() method will have an existing cart, so you may wish to check for a cookie and
        // redirect if there isn't one.  However, it is possible that you wish to create a cart, update it, and hand it off
        // to UltraCart all within one script, so we've left the conditional cart creation calls intact.

        CheckoutHandoffRequest handoffRequest = new CheckoutHandoffRequest();
        handoffRequest.setCart(cart);
        handoffRequest.setOperation(CheckoutHandoffRequest.OperationEnum.VIEW);
        handoffRequest.setErrorReturnUrl("/some/page/on/this/php/server/that/can/handle/errors/if/ultracart/encounters/an/issue/with/this/cart.php");
        handoffRequest.setErrorParameterName("uc_error"); // name this whatever the script supplied in ->setErrorReturnUrl() will check for in the $_GET object.
        handoffRequest.setSecureHostName("mystorefront.com"); // set to desired storefront.  some merchants have multiple storefronts.
        CheckoutHandoffResponse handoffResponse = checkoutApi.handoffCart(handoffRequest, expansion);

        if (handoffResponse.getErrors() != null && !handoffResponse.getErrors().isEmpty()) {
            // TODO: handle errors that might happen before handoff and manage those
        } else {
            String redirectUrl = handoffResponse.getRedirectToUrl();
            System.out.println(redirectUrl);
            // Issue the redirect to the customer.
            // HttpContext.Current.Response.Redirect(redirectUrl);
        }
    }
}