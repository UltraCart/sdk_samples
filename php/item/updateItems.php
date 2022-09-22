<?php
/** @noinspection SpellCheckingInspection */
/** @noinspection GrazieInspection */

use ultracart\v2\ApiException;
use ultracart\v2\models\ItemsRequest;

require_once '../vendor/autoload.php';
require_once '../samples.php';
require_once './item_functions.php'; // <-- see this file for details

try {

    $item_id1 = insertSampleItem();
    $item_id2 = insertSampleItem();

    $item_api = Samples::getItemApi();

    // See one of the getItem or getItems samples for possible expansion values
    // See also: https://www.ultracart.com/api/#resource_item.html
    $expand = "pricing";
    $api_response = $item_api->getItemByMerchantItemId($item_id1, $expand, false);
    $item1 = $api_response->getItem();
    $api_response = $item_api->getItemByMerchantItemId($item_id2, $expand, false);
    $item2 = $api_response->getItem();



    // update the price of the item.
    $item1->getPricing()->setCost(12.99);
    $item2->getPricing()->setCost(14.99);

    $update_items_request = new ItemsRequest();
    $items = [$item1, $item2];
    $update_items_request->setItems($items);
    $api_response = $item_api->updateItems($update_items_request, $expand, false, false);


    deleteSampleItem($item_id1);
    deleteSampleItem($item_id2);

} catch (ApiException $e) {
    echo 'An ApiException occurred.  Please review the following error:';
    var_dump($e); // <-- change_me: handle gracefully
    die(1);
}
