<?php /** @noinspection DuplicatedCode */

// Reference Implementation: https://github.com/UltraCart/responsive_checkout
// A simple method for populating the state_region list boxes with all the states/regions allowed for a country code.

require_once '../vendor/autoload.php';
require_once '../constants.php';

$checkout_api = ultracart\v2\api\CheckoutApi::usingApiKey(Constants::API_KEY);

$country_code = 'US';

$api_response = $checkout_api->getStateProvincesForCountry($country_code);
$provinces = $api_response->getStateProvinces();

foreach ($provinces as $province) {
    var_dump($province); // contains both name and abbreviation
}