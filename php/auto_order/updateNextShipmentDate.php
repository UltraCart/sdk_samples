<?php

use ultracart\v2\api\AutoOrderApi;

ini_set('display_errors', 1);

/*
 * This method illustrates changing the next shipment date for an auto order.
 */

require_once '../vendor/autoload.php';

$auto_order_api = AutoOrderApi::usingApiKey(Constants::API_KEY, Constants::MAX_RETRY_SECONDS, Constants::VERIFY_SSL, Constants::DEBUG);

$_expand = "items"; // see https://www.ultracart.com/api/#resource_auto_order.html for list
$auto_order_oid = 123456789; // get an auto order and update it.  There are many ways to retrieve an auto order.
$api_response = $auto_order_api->getAutoOrder($auto_order_oid);
$auto_order = $api_response->getAutoOrder();

$date = new DateTime('2025-12-30');
$iso8601 = $date->format('c');

// Note: The next shipment date is part of each ITEM, not the order itself.  Within UltraCart, each auto order item
// may have a separate schedule.  So if you wish to change the entire order, be sure to set each item.
$items = $auto_order->getItems();
foreach ($items as $item) {
    $item->setNextShipmentDts($iso8601);
}

$validate_original_order = 'No';
$api_response = $auto_order_api->updateAutoOrder($auto_order_oid, $auto_order, $validate_original_order, $_expand);
$updated_auto_order = $api_response->getAutoOrder();
var_dump($updated_auto_order);

