<?php

ini_set('display_errors', 1);

/*
    Adjusts the cashback balance of a customer.  This method's name is adjustInternalCertificate, which
    is a poor choice of naming, but results from an underlying implementation of using an internal gift certificate
    to track cashback balance.  Sorry for the confusion.

    This method requires a customer profile oid.  This is a unique number used by UltraCart to identify a customer.
    If you do not know a customer's oid, call getCustomerByEmail() to retrieve the customer and their oid.

    Possible Errors:
    Missing adjustment amount -> "adjust_internal_certificate_request.adjustment_amount is required and was missing"

 */


use ultracart\v2\api\CustomerApi;
use ultracart\v2\models\AdjustInternalCertificateRequest;

require_once '../vendor/autoload.php';
require_once '../constants.php';


$customer_api = CustomerApi::usingApiKey(Constants::API_KEY);


$email = "test@ultracart.com";
$customer = $customer_api->getCustomerByEmail($email)->getCustomer();
$customer_oid = $customer->getCustomerProfileOid();

$adjustRequest = new AdjustInternalCertificateRequest();
$adjustRequest->setDescription("Adjusting customer cashback balance because they called and complained about product.");
$adjustRequest->setExpirationDays(365); // expires in 365 days
$adjustRequest->setVestingDays(45); // customer has to wait 45 days to use it.
$adjustRequest->setAdjustmentAmount(59); // add 59 to their balance.
$adjustRequest->setOrderId('DEMO-12345'); // or leave null.  this ties the adjustment to a particular order.
$adjustRequest->setEntryDts(null); // use current time.

$api_response = $customer_api->adjustInternalCertificate($customer_oid, $adjustRequest);

if ($api_response->getError() != null) {
    error_log($api_response->getError()->getDeveloperMessage());
    error_log($api_response->getError()->getUserMessage());
    exit();
}

echo '<html lang="en"><body><pre>';
echo 'Success: ' . $api_response->getSuccess() . "<br/>";
echo 'Adjustment Amount: ' . $api_response->getAdjustmentAmount() . '<br/>';
echo 'Balance Amount: ' . $api_response->getBalanceAmount() . '<br/>';

var_dump($api_response);
echo '</pre></body></html>';
