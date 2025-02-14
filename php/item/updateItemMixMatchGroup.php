<?php
/** @noinspection SpellCheckingInspection */
/** @noinspection GrazieInspection */

use ultracart\v2\ApiException;

require_once '../vendor/autoload.php';
require_once '../samples.php';
require_once './item_functions.php'; // <-- see this file for details

echo "<html><body><pre>";
try {

    $item_id = insertSampleItem();

    $item_api = Samples::getItemApi();

    // See one of the getItem or getItems samples for possible expansion values
    // See also: https://www.ultracart.com/api/#resource_item.html
    $expand = "pricing";
    $api_response = $item_api->getItemByMerchantItemId($item_id, $expand, false);
    $item = $api_response->getItem();
    $original_price = $item->getPricing()->getCost();

    // update the price of the item.
    $item_pricing = $item->getPricing();
    $item_pricing->setCost(12.99);
    $item_pricing->setMixAndMatchGroup("test");

    $api_response = $item_api->updateItem($item->getMerchantItemOid(), $item, $expand, false);
    $updated_item = $api_response->getItem();

    // ensure the price was updated.
    echo("This is the updated item.");
    var_dump($updated_item); // <-- change_me: handle gracefully
    deleteSampleItem($item_id);

} catch (ApiException $e) {
    echo 'An ApiException occurred.  Please review the following error:';
    var_dump($e); // <-- change_me: handle gracefully
    die(1);
}
echo "</pre></body></html>";