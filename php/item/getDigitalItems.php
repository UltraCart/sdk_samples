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

    $digital_item_oid = insertSampleDigitalItem(); // create an item so I can get an item
    $item_api = Samples::getItemApi();

    $_limit = 100;
    $_offset = 0;
    $_since = null; //  digital items do not use since.  leave as null.
    $_sort = null; // if null, use default of original_filename
    $_expand = null; // digital items have no expansion.  leave as null.  this value is ignored
    $_placeholders = null; // digital items have no placeholders. leave as null.

    $api_response = $item_api->getDigitalItems($_limit, $_offset, $_since, $_sort, $_expand, $_placeholders);
    $digital_items = $api_response->getDigitalItems(); // assuming this succeeded

    echo 'The following items were retrieved via getDigitalItems():';
    foreach ($digital_items as $digital_item) {
        var_dump($digital_item);
    }


} catch (ApiException $e) {
    echo 'An ApiException occurred.  Please review the following error:';
    var_dump($e); // <-- change_me: handle gracefully
    die(1);
}