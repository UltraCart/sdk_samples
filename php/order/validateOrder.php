<?php

ini_set('display_errors', 1);

use ultracart\v2\api\OrderApi;
use ultracart\v2\models\OrderValidationRequest;

require_once '../vendor/autoload.php';
require_once '../constants.php';

/*
    validateOrder may be used to check for any and all validation errors that may result from an insertOrder
    or updateOrder call.  Because those method are built on our existing infrastructure, some validation
    errors may not bubble up to the rest api call and instead be returned as generic "something went wrong" errors.
    This call will return detail validation issues needing correction.

    Within the ValidationRequest, you may leave the 'checks' array null to check for everything, or pass
    an array of the specific checks you desire.  Here is a list of the checks:

    "Billing Address Provided"
    "Billing Destination Restriction"
    "Billing Phone Numbers Provided"
    "Billing State Abbreviation Valid"
    "Billing Validate City State Zip"
    "Email provided if required"
    "Gift Message Length"
    "Item Quantity Valid"
    "Items Present"
    "Merchant Specific Item Relationships"
    "One per customer violations"
    "Referral Code Provided"
    "Shipping Address Provided"
    "Shipping Destination Restriction"
    "Shipping Method Ignore Invalid"
    "Shipping Method Provided"
    "Shipping State Abbreviation Valid"
    "Shipping Validate City State Zip"
    "Special Instructions Length"

 */


$order_api = OrderApi::usingApiKey(Constants::API_KEY, false, false);

$expansion = "checkout"; // see the getOrder sample for expansion discussion

$order_id = 'DEMO-0009104976';
$order = $order_api->getOrder($order_id, $expansion)->getOrder();

echo '<html lang="en"><body><pre>';
var_dump($order);

// TODO: do some updates to the order.
$validationRequest = new OrderValidationRequest();
$validationRequest->setOrder($order);
$validationRequest->setChecks(null); // leaving this null to perform all validations.

$api_response = $order_api->validateOrder($validationRequest);

echo 'Validation errors:<br>';
if ($api_response->getErrors() != null) {
    foreach ($api_response->getErrors() as $error) {
        echo $error . "\n";
    }
}

echo 'Validation messages:<br>';
if ($api_response->getMessages() != null) {
    foreach ($api_response->getMessages() as $message) {
        echo $message . "\n";
    }
}

echo '</pre></body></html>';
