<?php

ini_set('display_errors', 1);

/*
 * OrderApi.getOrdersByRma() retrieves the orders that have a given RMA (return merchandise authorization) number.
 *
 * The search is an exact match only.  Wildcards are not supported, and an rma containing * returns a 400 error.
 * More than one order can share the same RMA, so the response contains a list of orders.
 *
 * This lookup is backed by the search index, so an RMA that was just assigned with OrderApi.assignRma()
 * may take a short time to appear in the results.
 *
 * Requires the order_read scope.
 */

use ultracart\v2\api\OrderApi;
use ultracart\v2\ApiException;

require_once '../vendor/autoload.php';
require_once '../constants.php';


$order_api = OrderApi::usingApiKey(Constants::API_KEY);

$rma = 'RMA-12345';

// see www.ultracart.com/api/ for all the expansion fields available
$expansion = "item,summary,billing,shipping";

try {
    $api_response = $order_api->getOrdersByRma($rma, $expansion);
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

$orders = $api_response->getOrders();

echo '<html lang="en"><body><pre>';
echo 'Orders found with RMA ' . $rma . ': ' . count($orders) . "\n";
foreach ($orders as $order) {
    echo $order->getOrderId() . "\n";
}
var_dump($orders);
echo '</pre></body></html>';
