<?php

ini_set('display_errors', 1);

/*
    acknowledgeOrders informs UltraCart that you (the fulfillment center) have received an order and have queued it for
    shipping.  This method is NOT used to notify an order has shipped, only that it is going to be shipped at some
    point in the future.

    This method should be called by a fulfillment center after receiving an order either by 1) getDistributionCenterOrders
    or 2) webhook.  Webhooks are the most efficient means for receiving orders, but if your fulfillment center lacks
    the ability to consume webhooks, polling by getDistributionCenterOrders is an alternate means.

    This method is important for notifying UltraCart that a fulfillment center has the action on an order.  Until this
    call is made, UltraCart will continue to notify a fulfillment center of an order either by 1) subsequent webhooks or
    2) continue to include an order in subsequent getDistributionCenterOrders.

    You will need the distribution center (DC) code.  UltraCart allows for multiple DC and the code is a
    unique short string you assign to a DC as an easy mnemonic.

    For more information about UltraCart distribution centers, please see:
    https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377114/Distribution+Center

    If you do not know your DC code, query a list of all DC and print them out.
    $result = $fulfillment_api->getDistributionCenters();
    print_r($result);

    A successful call will receive back a status code 204 (No Content).

    Possible Errors:
    More than 100 order ids provided -> "order_ids can not contain more than 100 records at a time"
 */


use ultracart\v2\ApiException;

require_once '../vendor/autoload.php';

$distribution_center_code = 'RAMI';
$fulfillment_api = Samples::getFulfillmentApi();

$orders_ids = ['DEMO-12345', 'DEMO-12346', 'DEMO-12347', 'DEMO-12348', 'DEMO-12349'];

echo '<pre>';

try {
    // limit is 100 acknowledgements at a time.
    $fulfillment_api->acknowledgeOrders($distribution_center_code, $orders_ids);
    echo "done";
} catch (ApiException $e) {
    // update inventory failed.  examine the reason.
    echo 'Exception when calling FulfillmentApi->acknowledgeOrders: ', $e->getMessage(), PHP_EOL;
    exit;
}