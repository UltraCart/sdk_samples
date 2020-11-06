<?php /* docs.ultracart.com sample */ ?>
<?php
 // Did you get an error?
 // See this: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/39077885/Troubleshooting+API+Errors
?>

<?php
// for testing and development only
set_time_limit(3000);
ini_set('max_execution_time', 3000);
ini_set('display_errors', 1);
error_reporting(E_ALL);
?>

<?php
// initialization code
require_once './vendor/autoload.php';
$simple_key = '4256aaf6dfedfa01582fe9a961ab0100216d737b874a4801582fe9a961ab0100';
ultracart\v2\Configuration::getDefaultConfiguration()->setApiKey('x-ultracart-simple-key', $simple_key);

$client = new GuzzleHttp\Client(['verify' => true, 'debug' => false]);
$config = ultracart\v2\Configuration::getDefaultConfiguration();
$headerSelector = new \ultracart\v2\HeaderSelector(/* leave null for version tied to this sdk version */);

$fulfillment_api = new ultracart\v2\api\FulfillmentApi($client, $config, $headerSelector);
?>

<!DOCTYPE html>
<html>
<body>
<?php


$distribution_center_code = 'DFLT';

// STEP 1: GET ORDERS NEEDING SHIPPING
// Best practice: Use a webhook instead of polling getOrders here.  That will provide instant response.
// This call does take an $expand parameter like many other getXXX calls.  The orders are returned with maximum
// expansion by default.  So all that's needed is the dc code.
try {
    $unacknowledged_orders_response = $fulfillment_api->getDistributionCenterOrders($distribution_center_code);
} catch (\ultracart\v2\ApiException $e) {
    // acknowledgement failed.  examine the reason.
    // $e->getResponseBody() has the good information
}
$unacknowledged_orders = $unacknowledged_orders_response->getOrders();


// STEP 2: ACKNOWLEDGE YOU HAVE RECEIVED ORDERS
// store the unacknowledged orders off somewhere for processing. (not shown here)
// then, acknowledge that you've received them.
// if you have more than 100 orders to acknowledge, send them in batches.  limit is 100.
$acknowledged_order_ids = [];
foreach ($unacknowledged_orders as $order) {
    echo $order->getOrderId() . "<br>";
    array_push($acknowledged_order_ids, $order->getOrderId());
}

try {
    $fulfillment_api->acknowledgeOrders($distribution_center_code, $acknowledged_order_ids);
} catch (\ultracart\v2\ApiException $e) {
    // acknowledgement failed.  examine the reason.
    // $e->getResponseBody() has the good information
}


// STEP 3: SHIP ORDERS
// Grab the first order.
$first_order = $unacknowledged_orders[0]; // this will obviously fail if there are none...
// create one or more shipment objects
$fulfillment_shipment = new \ultracart\v2\models\FulfillmentShipment();
$fulfillment_shipment->setOrderId($first_order->getOrderId());
$fulfillment_shipment->setTrackingNumbers(['TrackingNo12345', 'TrackingNo67890']);

$shipments = [$fulfillment_shipment]; // just a single shipment this time

try {
    $fulfillment_api->shipOrders($distribution_center_code, $shipments);
} catch (\ultracart\v2\ApiException $e) {
    // shipment notification failed.  examine the reason.
    // $e->getResponseBody() has the good information
}


// STEP 4: UPDATE INVENTORIES AS NEEDED
// update inventories as needed.
$first_inventory = new \ultracart\v2\models\FulfillmentInventory();
$first_inventory->setItemId('BONE');
$first_inventory->setQuantity(2500);

$second_inventory = new \ultracart\v2\models\FulfillmentInventory();
$second_inventory->setItemId('BONE');
$second_inventory->setQuantity(2500);

$inventory_updates = [$first_inventory, $second_inventory];

try {
    // limit is 500 inventory updates at a time.  batch them if you're going large.
    $fulfillment_api->updateInventory($distribution_center_code, $inventory_updates);
} catch (\ultracart\v2\ApiException $e) {
    // update inventory failed.  examine the reason.
    // $e->getResponseBody() has the good information
}


?>
<!-- helpful diagnostics -->
<pre>
<?php echo print_r($unacknowledged_orders_response); ?>
<?php echo print_r($unacknowledged_orders); ?>
</pre>
<?php echo 'Finished.'; ?>
</body>
</html>
