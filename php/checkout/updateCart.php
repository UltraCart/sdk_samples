<?php /** @noinspection DuplicatedCode */

require_once '../vendor/autoload.php';
require_once '../constants.php';

// Reference Implementation: https://github.com/UltraCart/responsive_checkout

// this example uses the getCart.php code as a starting point, because we must get a cart to update a cart.
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

// for this simple example, items will be added to the cart.  so our expansion variable is simply 'items' above.
// Get the items array on the cart, creating it if it doesn't exist.
$items = $cart->getItems();
// If null, go ahead and initialize it to an empty array
if ($items == null) {
    $items = array();
}

// Create a new item
$item = new ultracart\v2\models\CartItem();
$item->setItemId("BASEBALL"); // TODO: Adjust the item id
$item->setQuantity(1); // TODO: Adjust the quantity

// TODO: If your item has options then you need to create a new ultracart\v2\models\CartItemOption object and push it into the array.
$options = array();
$item->setOptions($options);

// Add the item to the $items array
array_push($items, $item);

// Make sure to update the $cart with the new array
$cart->setItems($items);

// Push the cart up to save the item
$cart_response = $checkout_api->updateCart($cart, $expansion);

// Extract the updated cart from the response
$cart = $cart_response->getCart();

// TODO: set or re-set the cart cookie if this is part of a multi-page process. two weeks is a generous cart id time.
setcookie(Constants::CART_ID_COOKIE_NAME, $cart->getCartId(), time() + 1209600, "/");


echo '<html lang="en"><body><pre>';
var_dump($cart);
echo '</pre></body></html>';