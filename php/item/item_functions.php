<?php

use ultracart\v2\ApiException;
use ultracart\v2\models\Item;
use ultracart\v2\models\ItemContent;
use ultracart\v2\models\ItemContentMultimedia;
use ultracart\v2\models\ItemDigitalItem;
use ultracart\v2\models\ItemPricing;

require_once '../vendor/autoload.php';
require_once '../samples.php';

// This example was designed for our run_samples.sh script, so the output is not html, but human-readable text.
// In an effort to be repeatable, this script will delete the item created.
// If you wish to inspect the created item in the backend, just comment out delete call

/**
 * @return string the newly created item id
 * @throws ApiException
 */
function insertSampleItem(): string{

    /** @noinspection SpellCheckingInspection */
    $item_id = 'sample_' . str_shuffle('ABCDEFGH');
    echo 'insertSampleItem will attempt to create item ' . $item_id;
    $item_api = Samples::getItemApi();

    $new_item = new Item();
    $new_item->setMerchantItemId($item_id);

    $pricing = new ItemPricing();
    $pricing->setCost(9.99);
    $new_item->setPricing($pricing);

    $new_item->setDescription('Sample description for item ' . $item_id);

    $multimedia = new ItemContentMultimedia();
    $multimedia->setUrl('https://upload.wikimedia.org/wikipedia/en/7/73/Mr._Clean_logo.png');
    $multimedia->setCode('default'); // <-- use 'default' to make this the default item.
    $multimedia->setDescription('Some random image i nabbed from wikipedia');


    $content = new ItemContent();
    $content->setMultimedia([$multimedia]); // <- notice this is an array
    $new_item->setContent($content);

    $expand = 'content.multimedia'; // I want to see the multimedia returned on the newly created object.

    echo 'insertItem request object follows:';
    var_dump($new_item);
    $api_response = $item_api->insertItem($new_item, $expand);
    echo 'insertItem response object follows:';
    var_dump($api_response);

    return $item_id;
}


/**
 * @param $item_id string item to be deleted
 * @return void
 * @throws ApiException
 */
function deleteSampleItem(string $item_id) {
    $item_api = Samples::getItemApi();

    echo 'deleteItem takes the item oid (internal unique identifier), so we need to retrieve the item first to delete';
    echo 'attempting to retrieve the item object for item id ' . $item_id;
    $expand = null; // I don't need extra fields here, just the base item will contain the oid
    $api_response = $item_api->getItemByMerchantItemId($item_id, $expand, false);
    $item = $api_response->getItem();
    echo 'The following object was retrieved:';
    var_dump($item);
    $merchant_item_oid = $item->getMerchantItemOid();

    echo 'calling deleteItem(' . $merchant_item_oid . ')';
    $item_api->deleteItem($merchant_item_oid);
}



/**
 * @return int the digital item oid for the newly created item
 * @throws ApiException
 */
function insertSampleDigitalItem(): int{

    $image_url = 'https://upload.wikimedia.org/wikipedia/commons/b/b7/Earth_%2816530938850%29.jpg'; // picture of the earth

    $digital_item = new ItemDigitalItem();
    $digital_item->setImportFromUrl($image_url);
    $digital_item->setDescription("The Earth");
    $digital_item->setClickWrapAgreement("By purchasing this item, you agree that it is Earth");

    echo 'insertDigitalItem request object follows:';
    var_dump($digital_item);


    $item_api = Samples::getItemApi();
    $api_response = $item_api->insertDigitalItem($digital_item);

    echo 'insertDigitalItem response object follows:';
    var_dump($api_response);

    return $api_response->getDigitalItem()->getDigitalItemOid();
}


/**
 * @param $digital_item_oid int the primary key of the digital item to be deleted.
 * @return void
 * @throws ApiException
 */
function deleteSampleDigitalItem(int $digital_item_oid) {
    $item_api = Samples::getItemApi();

    echo 'calling deleteItem(' . $digital_item_oid . ')';
    $item_api->deleteDigitalItem($digital_item_oid);
}

