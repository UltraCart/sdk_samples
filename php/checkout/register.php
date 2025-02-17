<?php /** @noinspection DuplicatedCode */

use ultracart\v2\models\CartBilling;
use ultracart\v2\models\CartProfileRegisterRequest;

require_once '../vendor/autoload.php';
require_once '../constants.php';
// Reference Implementation: https://github.com/UltraCart/responsive_checkout

// Registers a user in your merchant system.  This will create a customer profile.
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
$cart->getBilling()->setEmail($email); // this is the username.


$registerRequest = new CartProfileRegisterRequest();
$registerRequest->setCart($cart); // will look for billing.email
$registerRequest->setPassword($password);

$api_response = $checkout_api->register($registerRequest);
$cart = $api_response->getCart(); // Important!  Get the cart from the response.

if($api_response->getSuccess()){
    echo 'Successfully registered new customer profile!<br>';
} else {
    foreach ($api_response->getErrors() as $error) {
        var_dump($error);
    }
}