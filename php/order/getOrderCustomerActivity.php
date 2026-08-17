<?php

ini_set('display_errors', 1);

use ultracart\v2\api\OrderApi;

require_once '../vendor/autoload.php';
require_once '../constants.php';

/*
    getOrderCustomerActivity returns the customer activity associated with the email address on an order.
    This includes email engagement history, email list and segment membership, lifetime metrics and email
    suppression status.

    A customer profile is NOT required and is not consulted.  The activity is keyed off the email address
    on the order, so this works for guest orders that have never had a customer profile established.  For
    the page views captured during the session that placed the order, use getOrderPageViewHistory instead.

    If the order has no valid email address, email and customer_activity both come back null.  That is a
    successful response rather than an error - without an email there is no activity record to find.

    Note: activity ts is a unix timestamp in milliseconds, not an ISO 8601 string like most dates in this API.

    Possible Errors:
    order_id does not start with the merchant id -> "Path parameter 'order_id' does not start with the merchant id.  Check your parameter value and call log."

 */


$order_api = OrderApi::usingApiKey(Constants::API_KEY, false, false);


$order_id = 'DEMO-0009104976';
$response = $order_api->getOrderCustomerActivity($order_id);

$customer_activity = $response->getCustomerActivity();

echo '<html lang="en"><body><pre>';
echo 'Customer activity for: ' . $response->getEmail() . "\n\n";

if ($customer_activity === null) {
    echo 'No customer activity found for this order.';
} else {
    var_dump($customer_activity->getActivities());
}

echo '</pre></body></html>';
