<?php
/** @noinspection SpellCheckingInspection */
/** @noinspection GrazieInspection */

use ultracart\v2\ApiException;

require_once '../vendor/autoload.php';
require_once '../samples.php';
require_once './item_functions.php'; // <-- see this file for details

try {

    /*
     * Please Note!
     * Digital Items are not normal items you sell on your site.  They are digital files that you may add to
     * a library and then attach to a normal item as an accessory or the main item itself.
     * See: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1376485/Digital+Items
     */

    $external_id = uniqid();
    echo 'My external id is ' . $external_id;
    $digital_item_oid = insertSampleDigitalItem($external_id); // create digital item with a specific external id I can later use.
    $item_api = Samples::getItemApi();
    $api_response = $item_api->getDigitalItemsByExternalId($external_id);
    $digital_items = $api_response->getDigitalItems(); // assuming this succeeded


    echo 'The following item was retrieved via getDigitalItem():';
    var_dump($digital_items);

    deleteSampleDigitalItem($digital_item_oid);

} catch (ApiException $e) {
    echo 'An ApiException occurred.  Please review the following error:';
    var_dump($e); // <-- change_me: handle gracefully
    die(1);
}


