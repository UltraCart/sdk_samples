<?php
/** @noinspection SpellCheckingInspection */
/** @noinspection GrazieInspection */

use ultracart\v2\ApiException;

require_once '../vendor/autoload.php';
require_once '../samples.php';
require_once './item_functions.php'; // <-- see this file for details

try {

    $digital_item_oid = insertSampleDigitalItem();

    $item_api = Samples::getItemApi();
    $api_response = $item_api->getDigitalItem($digital_item_oid);
    $digital_item = $api_response->getDigitalItem();

    $digital_item->setDescription("I have updated the description to this sentence.");
    $digital_item->setClickWrapAgreement("You hereby agree that the earth is round.  No debate.");

    $item_api->updateDigitalItem($digital_item_oid, $digital_item);

    deleteSampleDigitalItem($digital_item_oid);

} catch (ApiException $e) {
    echo 'An ApiException occurred.  Please review the following error:';
    var_dump($e); // <-- change_me: handle gracefully
    die(1);
}
