<?php /** @noinspection DuplicatedCode */

require_once '../vendor/autoload.php';
require_once '../constants.php';

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

$checkout_api = ultracart\v2\api\CheckoutApi::usingApiKey(Constants::API_KEY);

$expansion = "items"; // for this example, we're just getting a cart to insert some items into it.

$cart_id = null;
if(isset($_COOKIE[Constants::CART_ID_COOKIE_NAME])){
    $cart_id = $_COOKIE[Constants::CART_ID_COOKIE_NAME];
}

$cart = null;
if(is_null($cart_id)){
    $api_response = $checkout_api->getCart($expansion);
} else {
    $api_response = $checkout_api->getCartByCartId($cart_id, $expansion);
}
$cart = $api_response->getCart();

// getCart.php code end ----------------------------------------------------------------------------


// Although the above code checks for a cookie and retrieves or creates a cart based on the cookie presence, typically
// a php script calling the handoff() method will have an existing cart, so you may wish to check for a cookie and
// redirect if there isn't one.  However, it is possible that you wish to create a cart, update it, and hand it off
// to UltraCart all within one script, so we've left the conditional cart creation calls intact.

$handoff_request = new \ultracart\v2\models\CheckoutHandoffRequest();
$handoff_request->setCart($cart);
$handoff_request->setOperation("view");
$handoff_request->setErrorReturnUrl("/some/page/on/this/php/server/that/can/handle/errors/if/ultracart/encounters/an/issue/with/this/cart.php");
$handoff_request->setErrorParameterName("uc_error"); // name this whatever the script supplied in ->setErrorReturnUrl() will check for in the $_GET object.
$handoff_request->setSecureHostName("mystorefront.com"); // set to desired storefront.  some merchants have multiple storefronts.
$api_response = $checkout_api->handoffCart($handoff_request, $expansion);


if(!is_null($api_response->getErrors()) && !empty($api_response->getErrors())){
    // TODO: handle errors that might happen before handoff and manage those
} else {
    $redirect_url = $api_response->getRedirectToUrl();
    header('Location: '. $redirect_url);
}