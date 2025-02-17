<?php /** @noinspection DuplicatedCode */

use ultracart\v2\models\CartFinalizeOrderRequest;
use ultracart\v2\models\CartFinalizeOrderRequestOptions;
use ultracart\v2\models\CartItem;

require_once '../vendor/autoload.php';
require_once '../constants.php';
// Reference Implementation: https://github.com/UltraCart/responsive_checkout

// Retrieves items related to the items within the cart.  Item relations are configured in the UltraCart backend.
// See: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377171/Related+Items

// Note: The returned items have a fixed expansion (only so many item properties are returned).  The item expansion is:
// content, content.assignments, content.attributes, content.multimedia, content.multimedia.thumbnails, options, pricing, and pricing.tiers

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

// TODO - add some items to the cart and update.

$items = [];
$cartItem = new CartItem();
$cartItem->setItemId('ITEM_ABC');
$cartItem->setQuantity(1);
$items[] = $cartItem;
$cart->setItems($items);

// update the cart and assign it back to our variable.
$cart = $checkout_api->updateCart($cart, $expansion)->getCart();

$api_response = $checkout_api->relatedItemsForCart($cart);
$related_items = $api_response->getItems();

echo '<html lang="en"><body><pre>';
var_dump($related_items);
echo '</pre></body></html>';