<?php

ini_set('display_errors', 1);

/*
    shipOrders informs UltraCart that you (the fulfillment center) have shipped an order and allows you to provide
    UltraCart with tracking information.

    You will need the distribution center (DC) code.  UltraCart allows for multiple DC and the code is a
    unique short string you assign to a DC as an easy mnemonic.

    For more information about UltraCart distribution centers, please see:
    https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377114/Distribution+Center

    If you do not know your DC code, query a list of all DC and print them out.
    $result = $fulfillment_api->getDistributionCenters();
    print_r($result);

    A successful call will receive back a status code 204 (No Content).

    Possible Errors:
    More than 100 order ids provided -> "shipments can not contain more than 100 records at a time"
 */


use ultracart\v2\ApiException;
use ultracart\v2\models\FulfillmentShipment;

require_once '../vendor/autoload.php';

$distribution_center_code = 'RAMI';
$fulfillment_api = Samples::getFulfillmentApi();

$shipment = new FulfillmentShipment();
$shipment->setOrderId('DEMO-12345');
$shipment->setTrackingNumbers(['UPS-1234567890', 'USPS-BLAH-BLAH-BLAH']); // this order had two boxes.
$shipment->setShippingCost(16.99); // the actual cost to ship this order
$shipment->setFulfillmentFee(8.99); // this fulfillment center is kinda pricey.
$shipment->setPackageCost(11.99); // 11.99?  we use only the finest packaging.

$shipments = [$shipment]; // up to 100 shipments per call

echo '<pre>';

try {
    // limit is 100 shipments updates at a time.
    $fulfillment_api->shipOrders($distribution_center_code, $shipments);
    echo "done";
} catch (ApiException $e) {
    // update inventory failed.  examine the reason.
    echo 'Exception when calling FulfillmentApi->shipOrders: ', $e->getMessage(), PHP_EOL;
    exit;
}