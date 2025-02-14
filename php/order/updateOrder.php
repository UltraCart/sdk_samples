<?php

ini_set('display_errors', 1);

use ultracart\v2\api\OrderApi;

require_once '../vendor/autoload.php';
require_once '../constants.php';


$order_api = OrderApi::usingApiKey(Constants::API_KEY, false, false);

$expansion = "checkout"; // see the getOrder sample for expansion discussion

$order_id = 'DEMO-0009104976';
$order = $order_api->getOrder($order_id, $expansion)->getOrder();

echo '<html lang="en"><body><pre>';
var_dump($order);

// TODO: do some updates to the order.

$api_response = $order_api->updateOrder($order_id, $order, $expansion);

if ($api_response->getError() != null) {
    error_log($api_response->getError()->getDeveloperMessage());
    error_log($api_response->getError()->getUserMessage());
    exit();
}

$updated_order = $api_response->getOrder();

echo '<br>After Update<br><br>';
var_dump($updated_order);
echo '</pre></body></html>';
