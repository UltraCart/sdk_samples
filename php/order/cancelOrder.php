<?php

/*
 * OrderApi.cancelOrder() will do just that.  It will cancel an order by rejecting it.
 * However, the following restrictions apply:
 * 1) If the order is already completed, this call will fail.
 * 2) If the order has already been rejected, this call will fail.
 * 3) If the order has already been transmitted to a fulfillment center, this call will fail.
 * 4) If the order is queued for transmission to a distribution center, this call will fail.
 */

require_once '../vendor/autoload.php';
require_once '../samples.php';

$order_api = Samples::getOrderApi();

$order_id = 'DEMO-0009104390';
$api_response = $order_api->cancelOrder($order_id);

if ($api_response->getError() != null) {
    error_log($api_response->getError()->getDeveloperMessage());
    error_log($api_response->getError()->getUserMessage());
    echo 'Order could not be canceled.  See php error log.';
    exit();
}

if($api_response->getSuccess()){
    echo 'Order was canceled successfully.';
}
