<?php

ini_set('display_errors', 1);

/*
 * AutoOrderApi.getAutoOrderUpdateBillingUrl() returns the update billing url for an auto order.
 *
 * This is the same url that is sent to the customer in the auto order update billing email.
 * If you only have an order id (the original order or any rebill), see OrderApi.getUpdateBillingUrl() instead.
 *
 * Requires the auto_order_write scope.  It is a write scope because the url carries a customer access token.
 *
 * WARNING: the update billing url grants access to the customer's billing information.  Do not log it
 * or expose it publicly in production.  It is printed below only for demonstration.
 */

use ultracart\v2\api\AutoOrderApi;
use ultracart\v2\ApiException;

require_once '../vendor/autoload.php';
require_once '../constants.php';


$auto_order_api = AutoOrderApi::usingApiKey(Constants::API_KEY);

$auto_order_oid = 123456789; // If you don't know the oid, use getAutoOrdersByQuery for retrieving auto orders

try {
    $api_response = $auto_order_api->getAutoOrderUpdateBillingUrl($auto_order_oid);
} catch (ApiException $e) {
    echo 'An ApiException occurred.  Please review the following error:';
    var_dump($e); // <-- change_me: handle gracefully
    die(1);
}

if ($api_response->getError() != null) {
    error_log($api_response->getError()->getDeveloperMessage());
    error_log($api_response->getError()->getUserMessage());
    exit();
}

// Sensitive.  Do not log or expose this url publicly in production.
$update_billing_url = $api_response->getUpdateBillingUrl();

echo '<html lang="en"><body><pre>';
echo 'Update Billing Url: ' . $update_billing_url . "\n";
echo '</pre></body></html>';
