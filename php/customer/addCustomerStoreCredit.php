<?php

ini_set('display_errors', 1);

/*
    Adds store credit to a customer's account.

    This method requires a customer profile oid.  This is a unique number used by UltraCart to identify a customer.
    If you do not know a customer's oid, call getCustomerByEmail() to retrieve the customer and their oid.

    Possible Errors:
    Missing store credit -> "store_credit_request.amount is missing and is required."
    Zero or negative store credit -> "store_credit_request.amount must be a positive amount."

 */


use ultracart\v2\api\CustomerApi;
use ultracart\v2\models\CustomerStoreCreditAddRequest;

require_once '../vendor/autoload.php';
require_once '../constants.php';


$customer_api = CustomerApi::usingApiKey(Constants::API_KEY);


$email = "test@ultracart.com";
$customer = $customer_api->getCustomerByEmail($email)->getCustomer();
$customer_oid = $customer->getCustomerProfileOid();

$storeCreditRequest = new CustomerStoreCreditAddRequest();
$storeCreditRequest->setAmount(20.00);
$storeCreditRequest->setDescription("Customer is super cool and I wanted to give them store credit.");
$storeCreditRequest->setExpirationDays(365); // or leave null for no expiration
$storeCreditRequest->setVestingDays(45); // customer has to wait 45 days to use it.

$api_response = $customer_api->addCustomerStoreCredit($customer_oid, $storeCreditRequest);

if ($api_response->getError() != null) {
    error_log($api_response->getError()->getDeveloperMessage());
    error_log($api_response->getError()->getUserMessage());
    exit();
}

echo '<html lang="en"><body><pre>';
var_dump($api_response->getSuccess());
echo '</pre></body></html>';
