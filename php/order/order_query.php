<?php

use ultracart\v2\HeaderSelector;
use ultracart\v2\models\OrderQuery;

set_time_limit(3000);
ini_set('max_execution_time', 3000);
ini_set('display_errors', 1);

error_reporting(E_ALL);
require_once '../vendor/autoload.php';
require '../simple_key.php'; # $simple_key is defined here.
require '../date_ranges.php'; # $begin_dts, $end_dts is defined here.


/** @noinspection PhpUndefinedVariableInspection */
ultracart\v2\Configuration::getDefaultConfiguration()->setApiKey('x-ultracart-simple-key', $simple_key);
$client = new GuzzleHttp\Client(['verify' => false, 'debug' => false]); // ensure verify is true for production.
$config = ultracart\v2\Configuration::getDefaultConfiguration();
$headerSelector = new HeaderSelector(/* leave null for version tied to this sdk version */);

$order_api = new ultracart\v2\api\OrderApi($client, $config, $headerSelector);

# for this example, we are querying an order and seeking the shipping method, tracking number,
# shipping cost (what customer was charged), and actual cost of shipping

// $order_id = "DEMO-0009104390";
$order_expansion = "item,summary,billing,shipping,shipping.tracking_number_details"; // see www.ultracart.com/api/ for all the expansion fields available
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


$order_query = new OrderQuery();
// $order_query->setOrderId($order_id);
/** @noinspection PhpUndefinedVariableInspection */$order_query->setShipmentDateBegin($begin_dts);
/** @noinspection PhpUndefinedVariableInspection */$order_query->setShipmentDateEnd($end_dts);
$orders_response = $order_api->getOrdersByQuery($order_query, 200, 0, null, $order_expansion);

if ($orders_response->getError() != null) {
    error_log($orders_response->getError()->getDeveloperMessage());
    error_log($orders_response->getError()->getUserMessage());
    exit();
}
$orders = $orders_response->getOrders();
if(sizeof($orders) == 0){
    error_log("There were no orders returned by this query.");
}

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

?>
