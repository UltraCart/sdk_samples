<?php /** @noinspection DuplicatedCode */

// Reference Implementation: https://github.com/UltraCart/responsive_checkout
// A simple method for populating the country list boxes with all the countries this merchant has configured to accept.

require_once '../vendor/autoload.php';
require_once '../constants.php';

$checkout_api = ultracart\v2\api\CheckoutApi::usingApiKey(Constants::API_KEY);

$api_response = $checkout_api->getAllowedCountries();
$allowed_countries = $api_response->getCountries();

foreach ($allowed_countries as $country) {
    var_dump($country); // contains both iso2code and name
}