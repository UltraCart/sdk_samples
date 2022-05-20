<?php

ini_set('display_errors', 1);

/*
 * OrderApi.adjustOrderTotal() takes a desired order total and performs goal-seeking to adjust all items and taxes
 * appropriately.  This method was created for merchants dealing with Medicare and Medicaid.  When selling their
 * medical devices, they would often run into limits approved by Medicare.  As such, they needed to adjust the
 * order total to match the approved amount.  This is a convenience method to adjust individual items and their
 * taxes to match the desired total.
 */

use ultracart\v2\api\OrderApi;

require_once '../vendor/autoload.php';
require_once '../constants.php';


$order_api = OrderApi::usingApiKey(Constants::API_KEY);

$order_id = 'DEMO-0009104390';
$desired_total = '21.99';
$api_response = $order_api->adjustOrderTotal($order_id, $desired_total);

if ($api_response->getError() != null) {
    error_log($api_response->getError()->getDeveloperMessage());
    error_log($api_response->getError()->getUserMessage());
    echo 'Order could not be adjusted.  See php error log.';
    exit();
}

if($api_response->getSuccess()){
    echo 'Order was adjusted successfully.  Use getOrder() to retrieve the order if needed.';
}
