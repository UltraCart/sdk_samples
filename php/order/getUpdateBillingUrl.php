<?php

ini_set('display_errors', 1);

/*
 * OrderApi.getUpdateBillingUrl() returns the update billing url for the auto order an order belongs to.
 *
 * This is the same url that is sent to the customer in the auto order update billing email.  The order
 * must belong to an auto order, otherwise a 400 error is returned.  Either the original order or any
 * rebill order of the auto order may be used.
 *
 * Requires the order_write scope.  It is a write scope because the url carries a customer access token.
 *
 * WARNING: the update billing url grants access to the customer's billing information.  Do not log it
 * or expose it publicly in production.  It is printed below only for demonstration.
 */

use ultracart\v2\api\OrderApi;
use ultracart\v2\ApiException;

require_once '../vendor/autoload.php';
require_once '../constants.php';


$order_api = OrderApi::usingApiKey(Constants::API_KEY);

$order_id = 'DEMO-0009104390'; // must be an order that belongs to an auto order

try {
    $api_response = $order_api->getUpdateBillingUrl($order_id);
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
