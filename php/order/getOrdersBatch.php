<?php

ini_set('display_errors', 1);

/*
 * This method is useful when you need to query a defined set of orders and would like to avoid querying them
 * one at a time.
 */

use ultracart\v2\api\OrderApi;
use ultracart\v2\models\OrderQueryBatch;

require_once '../vendor/autoload.php';
require_once '../constants.php';


$order_api = OrderApi::usingApiKey(Constants::API_KEY);


$expansion = "item,summary,billing,shipping,shipping.tracking_number_details";
// see www.ultracart.com/api/ for all the expansion fields available (this list below may become stale)
/*
Possible Order Expansions:
affiliate           affiliate.ledger                    auto_order
billing             channel_partner                     checkout
coupon              customer_profile                    digital_order
edi                 fraud_score                         gift
gift_certificate    internal                            item
linked_shipment     marketing                           payment
payment.transaction quote                               salesforce
shipping            shipping.tracking_number_details    summary
taxes
*/

$order_batch = new OrderQueryBatch();
$order_ids = array('DEMO-0009104390', 'DEMO-0009104391', 'DEMO-0009104392');
$order_batch->setOrderIds($order_ids);

$api_response = $order_api->getOrdersBatch($order_batch, $expansion);

if ($api_response->getError() != null) {
    error_log($api_response->getError()->getDeveloperMessage());
    error_log($api_response->getError()->getUserMessage());
    exit();
}

$orders = $api_response->getOrders();
if(sizeof($orders) == 0){
    error_log("There were no orders returned by this query.");
}

// do something with the orders.  for this example, we're just accessing many properties as illustration.
foreach ($orders as $order) {
    $summary = $order->getSummary();
    $actual_shipping_cost = is_null($summary->getActualShipping()) ? 0 : $summary->getActualShipping()->getLocalized();

    $currentStage = $order->getCurrentStage();
    $s_addr = $order->getShipping();
    $trackingNumbers = $s_addr->getTrackingNumbers();
    foreach ($trackingNumbers as $tnum) {
        // do something with tracking number here.
    }
    $sfname = $s_addr -> getFirstName();
    $slname = $s_addr -> getLastName();
    $saddress1 = $s_addr->getAddress1();
    $saddress2 = $s_addr->getAddress2();
    $scity = $s_addr->getCity();
    $sregion = $s_addr->getStateRegion();
    $sccode = $s_addr->getCountryCode();
    $spcode = $s_addr->getPostalCode();
    $sdayphone = $s_addr->getDayPhone();
    $shipping_method = $s_addr->getShippingMethod();

    $b_addr = $order->getBilling();
    $b_addr->getAddress1();
    $b_addr->getAddress2();
    $b_addr->getCity();
    $b_addr->getStateRegion();
    $b_addr->getCountryCode();
    $b_addr->getPostalCode();
    $bemail = $b_addr->getEmail(); // email is located on the billing object.

    // here is how to access the items
    $items = $order->getItems();
    foreach ($items as $item) {
        $qty = $item->getQuantity();
        $itemId = $item->getMerchantItemId();
        $description = $item->getDescription();
        $cost = $item->getCost();
        $cost->getLocalized(); // cost as float.
        $real_cost = $cost->getLocalizedFormatted(); // cost with symbols.
    }
}

// this could get verbose depending on the size of your batch ...
echo '<html lang="en"><body><pre>';
var_dump($orders);
echo '</pre></body></html>';
