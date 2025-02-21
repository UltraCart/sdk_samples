<?php
// Retrieve a list of item inventories.
// This method may be called once every 15 minutes.  More than that will result in a 429 response.

use ultracart\v2\api\ItemApi;
use ultracart\v2\ApiException;

require_once '../vendor/autoload.php';

try {

    $item_api = ItemApi::usingApiKey(Constants::API_KEY);
    $api_response = $item_api->getInventorySnapshot();
    $inventories = $api_response->getInventories();

    foreach($inventories as $inventory){
        var_dump($inventory);
    }

} catch (ApiException $e) {
    echo 'An ApiException occurred.  Please review the following error:';
    var_dump($e); // <-- change_me: handle gracefully
    die(1);
}

