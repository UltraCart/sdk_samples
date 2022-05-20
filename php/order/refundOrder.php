<?php /** @noinspection DuplicatedCode */

require_once '../vendor/autoload.php';
require_once '../constants.php';

/*
 * refundOrder() allows for both partial and complete refunds.  Both are accomplished with the same steps.
 * 1) retrieve an order object using the SDK.
 * 2) input the refunded quantities for any or all items
 * 3) call refundOrder, passing in the modified object.
 * 4) To do a full refund, set all item refund quantities to their purchased quantities.
 *
 * This example will perform a full refund.
 *
 */

use ultracart\v2\api\OrderApi;
use ultracart\v2\models\Order;
use ultracart\v2\models\OrderItem;

$order_api = OrderApi::usingApiKey(Constants::API_KEY, 0, false);

// for the refund, I only need the items expanded to adjust their quantities.
// See: https://www.ultracart.com/api/  for a list of all expansions.
$expansion = "items";

// Step 1. Retrieve the order
$order_id = 'DEMO-0009104436';
$order = $order_api->getOrder($order_id, $expansion)->getOrder();


foreach($order->getItems() as $item){
    $item->setQuantityRefunded($item->getQuantity());
}

$reject_after_refund = false;
$skip_customer_notification = true;
$cancel_associated_auto_orders = true; // does not matter for this sample. the order is not a recurring order.
$consider_manual_refund_done_externally = false; // no, I want an actual refund done through my gateway
$reverse_affiliate_transactions = true; // can't let my affiliates get money on a refunded order.  bad business.

/** @noinspection PhpConditionAlreadyCheckedInspection */
$api_response = $order_api->refundOrder($order, $order_id, $reject_after_refund, $skip_customer_notification,
    $cancel_associated_auto_orders, $consider_manual_refund_done_externally, $reverse_affiliate_transactions, $expansion);

$refunded_order = $api_response->getOrder();

// examined the subtotals and ensure everything was refunded correctly.
echo '<html lang="en"><body><pre>';
var_dump($refunded_order);
echo '</pre></body></html>';
