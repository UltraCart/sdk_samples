<?php

use ultracart\v2\api\ItemApi;

ini_set('display_errors', 1);

/*
    Retrieves all user reviews for an item.

    The merchant_item_oid is a unique identifier used by UltraCart.  If you do not know your item's oid, call
    ItemApi.getItemByMerchantItemId() to retrieve the item, and then it's oid $item->getMerchantItemOid()



 */


require_once '../vendor/autoload.php';
require_once '../constants.php';


$item_api = ItemApi::usingApiKey(Constants::API_KEY);
$merchant_item_oid = 123456;
$api_response = $item_api->getReviews($merchant_item_oid);


if ($api_response->getError() != null) {
    error_log($api_response->getError()->getDeveloperMessage());
    error_log($api_response->getError()->getUserMessage());
    exit();
}

$reviews = $api_response->getReviews();

echo '<html lang="en"><body><pre>';
foreach ($reviews as $review) {
    var_dump($review);
}
echo '</pre></body></html>';
