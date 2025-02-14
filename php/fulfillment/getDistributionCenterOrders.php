<?php

ini_set('display_errors', 1);

/*
    getDistributionCenterOrders accepts a distribution center code and returns back up to 100 orders that need shipping.
    There is NO pagination with this method call.  Once you receive the orders, you should insert them into your
    system, and acknowledge them via the acknowledgeOrders call.  After you acknowledge the orders, subsequent calls
    to getDistributionCenterOrders will return another batch of 100 orders.

    The orders that are returned contain only items for THIS distribution center and are by default completely expanded
    with billing, channel_partner, checkout, coupons, customer_profile, edi, gift, gift_certificate, internal,
    items, payment, shipping, summary, taxes

    You will need the distribution center (DC) code.  UltraCart allows for multiple DC and the code is a
    unique short string you assign to a DC as an easy mnemonic.

    For more information about UltraCart distribution centers, please see:
    https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377114/Distribution+Center

    If you do not know your DC code, query a list of all DC and print them out.
    $result = $fulfillment_api->getDistributionCenters();
    print_r($result);

 */


use ultracart\v2\ApiException;

require_once '../vendor/autoload.php';

$fulfillment_api = Samples::getFulfillmentApi();

echo '<pre>';

try {

    $acknowledged_orders = [];
    $distribution_center_code = 'RAMI';
    $result = $fulfillment_api->getDistributionCenterOrders($distribution_center_code);
    $orders = $result->getOrders();
    foreach ($orders as $order) {
        print_r($order);
        // TODO: do something useful with this order, like adding it to your shipping queue.
        $acknowledged_orders[] = $order->getOrderId();
    }

    // TODO: once you've securely and completely received it into your system, acknowledge the order.
    $fulfillment_api->acknowledgeOrders($distribution_center_code, $acknowledged_orders);

    // After acknowledging orders, you should call getDistributionCenterOrders again until you receive zero orders to ship.

    echo "done";
} catch (ApiException $e) {
    // update inventory failed.  examine the reason.
    echo 'Exception when calling FulfillmentApi->getDistributionCenterOrders: ', $e->getMessage(), PHP_EOL;
    exit;
}