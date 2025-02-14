<?php

ini_set('display_errors', 1);

/*
    updateInventory is a simple means of updating UltraCart inventory for one or more items (500 max per call)
    You will need the distribution center (DC) code.  UltraCart allows for multiple DC and the code is a
    unique short string you assign to a DC as an easy mnemonic.

    For more information about UltraCart distribution centers, please see:
    https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377114/Distribution+Center

    If you do not know your DC code, query a list of all DC and print them out.
    $result = $fulfillment_api->getDistributionCenters();
    print_r($result);

    Possible Errors:
    More than 500 items provided -> "inventories can not contain more than 500 records at a time"
 */


use ultracart\v2\ApiException;
use ultracart\v2\models\FulfillmentInventory;

require_once '../vendor/autoload.php';

$distribution_center_code = 'RAMI';
$fulfillment_api = Samples::getFulfillmentApi();

$sku = '9780982021361';
$quantity = 9;
$first_inventory = new FulfillmentInventory();
$first_inventory->setItemId($sku);
$first_inventory->setQuantity($quantity);
$inventory_updates = [ $first_inventory ]; // for this example, we're only updating one item.

echo '<pre>';
print_r($inventory_updates);

try {
    // limit is 500 inventory updates at a time.  batch them if you're going large.
    $fulfillment_api->updateInventory($distribution_center_code, $inventory_updates);
    echo "done";
} catch (ApiException $e) {
    // update inventory failed.  examine the reason.
    echo 'Exception when calling FulfillmentApi->updateInventory: ', $e->getMessage(), PHP_EOL;
    exit;
}