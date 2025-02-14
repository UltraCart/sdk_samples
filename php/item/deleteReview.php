<?php

use ultracart\v2\api\ItemApi;

ini_set('display_errors', 1);

/*
    Deletes a specific user review for an item.  This would most likely be used by a merchant who has cached all
    reviews on a separate site and then wishes to remove a particular review.

    The merchant_item_oid is a unique identifier used by UltraCart.  If you do not know your item's oid, call
    ItemApi.getItemByMerchantItemId() to retrieve the item, and then it's oid $item->getMerchantItemOid()

    The review_oid is a unique identifier used by UltraCart.  If you do not know a review's oid, call
    ItemApi.getReviews() to get all reviews where you can then grab the oid from an item.

    Success returns back a status code of 204 (No Content)

 */


require_once '../vendor/autoload.php';
require_once '../constants.php';


$item_api = ItemApi::usingApiKey(Constants::API_KEY);
$merchant_item_oid = 123456;
$review_oid = 987654;
$item_api->deleteReview($review_oid, $merchant_item_oid);