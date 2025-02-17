<?php /** @noinspection DuplicatedCode */

use ultracart\v2\models\CartFinalizeOrderRequest;
use ultracart\v2\models\CartFinalizeOrderRequestOptions;

require_once '../vendor/autoload.php';
require_once '../constants.php';
// Reference Implementation: https://github.com/UltraCart/responsive_checkout

// Note: You probably should NOT be using this method.  Use handoffCart() instead.
// This method is a server-side only (no browser key allowed) method for turning a cart into an order.
// It exists for merchants who wish to provide their own upsells, but again, a warning, using this method
// will exclude the customer checkout from a vast and powerful suite of functionality provided free by UltraCart.
// Still, some merchants need this functionality, so here it is.  If you're unsure, you don't need it.  Use handoff.

$checkout_api = ultracart\v2\api\CheckoutApi::usingApiKey(Constants::API_KEY);

$expansion = "customer_profile,items,billing,shipping,coupons,checkout,payment,summary,taxes"; //
// Possible Expansion Variables: (see https://www.ultracart.com/api/#resource_checkout.html
/*
affiliate                   checkout	                        customer_profile
billing                     coupons                             gift
gift_certificate	        items.attributes	                items.multimedia
items	                    items.multimedia.thumbnails         items.physical
marketing	                payment	                            settings.gift
settings.billing.provinces	settings.shipping.deliver_on_date   settings.shipping.estimates
settings.shipping.provinces	settings.shipping.ship_on_date	    settings.taxes
settings.terms	            shipping	                        taxes
summary	                    upsell_after
 */


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

// TODO - add some items, collect billing and shipping, use hosted fields to collect payment, etc.

$finalizeRequest = new CartFinalizeOrderRequest();
$finalizeRequest->setCart($cart);
$finalizeOptions = new CartFinalizeOrderRequestOptions(); // Lots of options here.  Contact support if you're unsure what you need.
$finalizeRequest->setOptions($finalizeOptions);

$api_response = $checkout_api->finalizeOrder($finalizeRequest);
// $api_response->getSuccessful();
// $api_response->getErrors();
// $api_response->getOrderId();
// $api_response->getOrder();

echo '<html lang="en"><body><pre>';
var_dump($api_response);
echo '</pre></body></html>';