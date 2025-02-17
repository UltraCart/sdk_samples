<?php /** @noinspection DuplicatedCode */

use ultracart\v2\models\CartBilling;
use ultracart\v2\models\CartProfileLoginRequest;

require_once '../vendor/autoload.php';
require_once '../constants.php';
// Reference Implementation: https://github.com/UltraCart/responsive_checkout

// This example logs a user OUT of the UltraCart system.
//  It assumes the shopping cart has already had a successful login.
// see login sdk_sample for logging in help.
// For new carts, getCart() is used.  For existing carts, getCartByCartId($cart_id) is used.

$checkout_api = ultracart\v2\api\CheckoutApi::usingApiKey(Constants::API_KEY);

// Note: customer_profile is a required expansion for login to work properly
$expansion = "customer_profile,items,billing,shipping,coupons,checkout,payment,summary,taxes";
// Possible Expansion Variables: (see https://www.ultracart.com/api/#resource_checkout.html

// create a new cart (change this to an existing if you have one)
$cart = $checkout_api->getCart($expansion)->getCart();

$email = 'test@test.com'; // collect this from user.
$password = 'ABC123'; // collect this from user.

$cart->setBilling(new CartBilling());
$cart->getBilling()->setEmail($email);

$loginRequest = new CartProfileLoginRequest();
$loginRequest->setCart($cart); // will look for billing.email
$loginRequest->setPassword($password);

$api_response = $checkout_api->login($loginRequest);
$cart = $api_response->getCart();

if($api_response->getSuccess()){
    $checkout_api->logout($cart, $expansion); // <-- Here is the logout call.
} else {
    // notify customer login failed. Until they login, you can't logout.
}