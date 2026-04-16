<?php

ini_set('display_errors', 1);

/*
 * Cancel a single item on an auto order, identified by the reference (original) order id
 * that placed the auto order and the original item id on that order. This is useful when
 * you know the original UltraCart order id rather than the auto_order_oid.
 */

require_once '../vendor/autoload.php';
require_once '../samples.php';

$auto_order_api = Samples::getAutoOrderApi();

$reference_order_id = "DEMO-12345678"; // the UltraCart order id that placed the auto order
$original_item_id   = "ITEM001";       // the merchant item id on that original order
$_expand            = "items";         // see https://www.ultracart.com/api/#resource_auto_order.html for list

$response = $auto_order_api->cancelAutoOrderItemByReferenceOrderId(
    $reference_order_id,
    $original_item_id,
    $_expand
);
$auto_order = $response->getAutoOrder();
var_dump($auto_order);
