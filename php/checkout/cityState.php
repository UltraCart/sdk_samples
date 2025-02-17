<?php /** @noinspection DuplicatedCode */

// Reference Implementation: https://github.com/UltraCart/responsive_checkout
// Takes a postal code and returns back a city and state (US Only)

use ultracart\v2\models\Cart;
use ultracart\v2\models\CartShipping;

require_once '../vendor/autoload.php';
require_once '../constants.php';


$checkout_api = ultracart\v2\api\CheckoutApi::usingApiKey(Constants::API_KEY);

$cartId = '123456789123456789123456789123456789';  // you should have the cart id from session or cookie.
$cart = new Cart();
$cart->setCartId($cartId); // required
$cart->setShipping(new CartShipping());
$cart->getShipping()->setPostalCode('44233');

$api_response = $checkout_api->cityState($cart);
echo 'City: ' . $api_response->getCity() . '<br>';
echo 'State: ' . $api_response->getState() . '<br>';