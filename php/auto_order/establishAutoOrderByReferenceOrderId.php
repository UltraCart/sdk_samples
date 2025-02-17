<?php


use ultracart\v2\models\AutoOrderItem;

ini_set('display_errors', 1);

/*
 *
 * This method takes a normal order id and creates an empty auto order from it.  While this might seem useless having
 * an auto order with no items, the original_order is used for shipping, billing, and payment information.
 * Once you have your empty auto order, add items to it and call updateAutoOrder.
 *
 */

require_once '../vendor/autoload.php';
require_once '../samples.php';


$auto_order_api = Samples::getAutoOrderApi();

$_expand = "items,items.future_schedules,original_order,rebill_orders"; // see https://www.ultracart.com/api/#resource_auto_order.html for list

$original_order_id = "DEMO-123457";
$api_response = $auto_order_api->establishAutoOrderByReferenceOrderId($original_order_id, $_expand);

$empty_auto_order = $api_response->getAutoOrder();
$auto_order_oid = $empty_auto_order->getAutoOrderOid();

$items = [];
$item = new AutoOrderItem();
$item->setOriginalItemId("ITEM_ABC"); // This item should be configured with auto order features.
$item->setOriginalQuantity(1);
$item->setArbitraryUnitCost(59.99);
// Valid Frequencies
// "Weekly", "Biweekly", "Every...", "Every 10 Days", "Every 4 Weeks", "Every 6 Weeks", "Every 8 Weeks", "Every 24 Days", "Every 28 Days", "Monthly",
// "Every 45 Days", "Every 2 Months", "Every 3 Months", "Every 4 Months", "Every 5 Months", "Every 6 Months", "Yearly"
$item->setFrequency("Monthly");
$items[] = $item;
$empty_auto_order->setItems($items);

$validate_original_order = 'No';
$api_response = $auto_order_api->updateAutoOrder($auto_order_oid, $empty_auto_order, $validate_original_order, $_expand);
$updated_auto_order = $api_response->getAutoOrder();
var_dump($updated_auto_order);