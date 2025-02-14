<?php

use ultracart\v2\api\ItemApi;

ini_set('display_errors', 1);

/*
    Retrieves a specific user review for an item.  This would most likely be used by a merchant who has cached all
    reviews on a separate site and then wishes to update a particular review.  It's always best to "get" the object,
    make changes to it, then call the update instead of trying to recreate the object from scratch.

    The merchant_item_oid is a unique identifier used by UltraCart.  If you do not know your item's oid, call
    ItemApi.getItemByMerchantItemId() to retrieve the item, and then it's oid $item->getMerchantItemOid()

    The review_oid is a unique identifier used by UltraCart.  If you do not know a review's oid, call
    ItemApi.getReviews() to get all reviews where you can then grab the oid from an item.


 */


require_once '../vendor/autoload.php';
require_once '../constants.php';


$item_api = ItemApi::usingApiKey(Constants::API_KEY);
$merchant_item_oid = 123456;
$review_oid = 987654;
$api_response = $item_api->getReview($review_oid, $merchant_item_oid);



if ($api_response->getError() != null) {
    error_log($api_response->getError()->getDeveloperMessage());
    error_log($api_response->getError()->getUserMessage());
    exit();
}

$review = $api_response->getReview();

echo '<html lang="en"><body><pre>';
var_dump($review);
echo '</pre></body></html>';
