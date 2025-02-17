<?php


use ultracart\v2\models\AutoOrderConsolidate;

ini_set('display_errors', 1);

/*
 *
 * consolidateAutoOrders
 * an auto order with no items, the original_order is used for shipping, billing, and payment information.
 * Once you have your empty auto order, add items to it and call updateAutoOrder.
 *
 */

require_once '../vendor/autoload.php';
require_once '../samples.php';


$auto_order_api = Samples::getAutoOrderApi();

$_expand = "items,items.future_schedules,original_order,rebill_orders"; // see https://www.ultracart.com/api/#resource_auto_order.html for list

$target_auto_order_oid = 123456789; // set getAutoOrdersByQuery for retrieving auto orders where you can get their auto_order_oid.
$consolidateRequest = new AutoOrderConsolidate();
$consolidateRequest->setSourceAutoOrderOids([23456789, 3456789]);  // these are the autoorder_oids you wish to consolidate into the target.

$api_response = $auto_order_api->consolidateAutoOrders($target_auto_order_oid, $consolidateRequest, $_expand);

$conslidated_auto_order = $api_response->getAutoOrder();

// TODO: make sure the consolidated order has all the items and history of all orders.
var_dump($conslidated_auto_order);