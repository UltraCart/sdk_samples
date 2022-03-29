<?php

require_once '../vendor/autoload.php';
require_once '../constants.php';

$order_api = ultracart\v2\api\OrderApi::usingApiKey(Constants::API_KEY);

$order_id = 'DEMO-0009104436';
$order_token_response = $order_api->generateOrderToken($order_id);
$order_token = $order_token_response->getOrderToken();

echo '<html lang="en"><body><pre>Order Token is: ' . $order_token . '</pre></body></html>';
