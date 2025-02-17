<?php /** @noinspection DuplicatedCode */

// Reference Implementation: https://github.com/UltraCart/responsive_checkout
// For a given cart id (the cart should be fully updated in UltraCart), returns back the json object
// needed to proceed with an Affirm checkout.  See https://www.affirm.com/ for details about Affirm.
// This sample does not show the construction of the affirm checkout widgets.  See the affirm api for those examples.

require_once '../vendor/autoload.php';
require_once '../constants.php';

$checkout_api = ultracart\v2\api\CheckoutApi::usingApiKey(Constants::API_KEY);
$cart_id = '123456789123456789123456789123456789'; // this should be retrieved from a session or cookie
$api_response = $checkout_api->getAffirmCheckout($cart_id);
if(!is_null($api_response->getErrors()) && count($api_response->getErrors()) > 0){
    // TODO: display errors to customer about the failure
    foreach ($api_response->getErrors() as $error) {
        var_dump($error);
    }
} else {
    var_dump($api_response->getCheckoutJson()); // this is the object to send to Affirm.
}
