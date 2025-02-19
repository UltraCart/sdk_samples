using System;
using System.Web;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.checkout
{
    public class HandoffCart
    {
        /// <summary>
        /// Hands off a cart to the UltraCart engine for further processing
        /// </summary>
        public static void Execute()
        {
            // Reference Implementation: https://github.com/UltraCart/responsive_checkout

            // this example uses the getCart.php code as a starting point, because we must get a cart to handoff a cart.
            // here, we are handing off the cart to the ultracart engine with an operation of 'view', meaning that we
            // simply added some items to the cart and wish for UltraCart to gather the remaining customer information
            // as part of a normal checkout operation.
            // valid operations are: "view", "checkout", "paypal", "paypalcredit", "affirm", "sezzle"
            // Besides "view", the other operations are finalizers.
            // "checkout": finalize the transaction using a customer's personal credit card (traditional checkout)
            // "paypal": finalize the transaction by sending the customer to PayPal

            // getCart.php code start ----------------------------------------------------------------------------

            // this example is the same for both getCart.php and getCartByCartId.php.  They work as a pair and are called
            // depending on the presence of an existing cart id or not.  For new carts, getCart() is used.  For existing
            // carts, getCartByCartId($cart_id) is used.

            CheckoutApi checkoutApi = new CheckoutApi(Constants.ApiKey);

            String expansion = "items"; // for this example, we're just getting a cart to insert some items into it.

            String cartId = null;
            // get the cartId from session or cookie.
            // if (HttpContext.Current.Request.Cookies[Constants.CART_ID_COOKIE_NAME] != null)
            // {
            //     cartId = HttpContext.Current.Request.Cookies[Constants.CART_ID_COOKIE_NAME].Value;
            // }

            Cart cart = null;
            CartResponse apiResponse;
            if (cartId == null)
            {
                apiResponse = checkoutApi.GetCart(expansion);
            }
            else
            {
                apiResponse = checkoutApi.GetCartByCartId(cartId, expansion);
            }
            cart = apiResponse.Cart;

            // getCart.php code end ----------------------------------------------------------------------------


            // Although the above code checks for a cookie and retrieves or creates a cart based on the cookie presence, typically
            // a php script calling the handoff() method will have an existing cart, so you may wish to check for a cookie and
            // redirect if there isn't one.  However, it is possible that you wish to create a cart, update it, and hand it off
            // to UltraCart all within one script, so we've left the conditional cart creation calls intact.

            CheckoutHandoffRequest handoffRequest = new CheckoutHandoffRequest();
            handoffRequest.Cart = cart;
            handoffRequest.Operation = CheckoutHandoffRequest.OperationEnum.View;
            handoffRequest.ErrorReturnUrl = "/some/page/on/this/php/server/that/can/handle/errors/if/ultracart/encounters/an/issue/with/this/cart.php";
            handoffRequest.ErrorParameterName = "uc_error"; // name this whatever the script supplied in ->setErrorReturnUrl() will check for in the $_GET object.
            handoffRequest.SecureHostName = "mystorefront.com"; // set to desired storefront.  some merchants have multiple storefronts.
            CheckoutHandoffResponse handoffResponse = checkoutApi.HandoffCart(handoffRequest, expansion);


            if (handoffResponse.Errors != null && handoffResponse.Errors.Count > 0)
            {
                // TODO: handle errors that might happen before handoff and manage those
            }
            else
            {
                String redirectUrl = handoffResponse.RedirectToUrl;
                Console.WriteLine(redirectUrl);
                // Issue the redirect to the customer.
                // HttpContext.Current.Response.Redirect(redirectUrl);
            }
        }
    }
}