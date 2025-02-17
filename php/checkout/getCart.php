<?php /** @noinspection DuplicatedCode */

require_once '../vendor/autoload.php';
require_once '../constants.php';
// Reference Implementation: https://github.com/UltraCart/responsive_checkout

// this example is the same for both getCart.php and getCartByCartId.php.  They work as a pair and are called
// depending on the presence of an existing cart id or not.  For new carts, getCart() is used.  For existing
// carts, getCartByCartId($cart_id) is used.

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

// TODO: set or re-set the cart cookie if this is part of a multi-page process. two weeks is a generous cart id time.
setcookie(Constants::CART_ID_COOKIE_NAME, $cart->getCartId(), time() + 1209600, "/");

echo '<html lang="en"><body><pre>';
var_dump($cart);
echo '</pre></body></html>';