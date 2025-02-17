<?php /** @noinspection DuplicatedCode */

require_once '../vendor/autoload.php';
require_once '../constants.php';
// Reference Implementation: https://github.com/UltraCart/responsive_checkout

// this example returns a shopping cart given a return_code.  The return_code is generated by UltraCart
// and usually emailed to a customer.  The email will provide a link to this script where you may use the
// return_code to retrieve the customer's cart.

$checkout_api = ultracart\v2\api\CheckoutApi::usingApiKey(Constants::API_KEY);

$expansion = "items,billing,shipping,coupons,checkout,payment,summary,taxes"; //
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

$return_code = '1234567890'; // usually retrieved from a query parameter
$api_response = $checkout_api->getCartByReturnCode($return_code, $expansion);
$cart = $api_response->getCart();

// TODO: set or re-set the cart cookie if this is part of a multi-page process. two weeks is a generous cart id time.
setcookie(Constants::CART_ID_COOKIE_NAME, $cart->getCartId(), time() + 1209600, "/");

echo '<html lang="en"><body><pre>';
var_dump($cart);
echo '</pre></body></html>';