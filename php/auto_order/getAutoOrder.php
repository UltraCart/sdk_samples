<?php

ini_set('display_errors', 1);

/*
 * retrieves an auto_order given the auto_order_oid;
 */

require_once '../vendor/autoload.php';
require_once '../samples.php';


$auto_order_api = Samples::getAutoOrderApi();

$_expand = "items,items.future_schedules,original_order,rebill_orders"; // see https://www.ultracart.com/api/#resource_auto_order.html for list
$auto_order_oid = 123456789; // If you don't know the oid, use getAutoOrdersByQuery for retrieving auto orders
$api_response = $auto_order_api->getAutoOrder($auto_order_oid, $_expand);
$auto_order = $api_response->getAutoOrder();
var_dump($auto_order);