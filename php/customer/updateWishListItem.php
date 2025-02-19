<?php

use ultracart\v2\api\CustomerApi;
use ultracart\v2\ApiException;
use ultracart\v2\models\CustomerWishListItem;

require_once '../vendor/autoload.php';
require_once '../samples.php';
require_once './customer_functions.php'; // <-- see this file for details
require_once '../item/item_functions.php'; // <-- needed to create sample items to wish for

/*
    The wishlist methods allow management of a customer's wishlist.
    This includes:
        deleteWishListItem
        getCustomerWishList
        getCustomerWishListItem
        insertWishListItem
        updateWishListItem
    These methods provide a standard CRUD interface.  The example below uses all of them.

    You'll need merchant_item_oids to insert wishlist items.  If you don't know the oids,
    call ItemApi.getItemByMerchantItemId() to retrieve the item, then get $item->getMerchantItemOid()

    Note: Priority of wishlist item, 3 being low priority and 5 is high priority.

 */

try {

    $customer_api = CustomerApi::usingApiKey(Constants::API_KEY);

    // create a few items first.
    $first_item_oid = insertSampleItemAndGetOid();
    $second_item_oid = insertSampleItemAndGetOid();

    // create a customer
    $customer_oid = insertSampleCustomer();

    // TODO: If you don't know the customer oid, use getCustomerByEmail() to retrieve the customer.

    // add some wish list items.
    $addWishItem = new CustomerWishListItem();
    $addWishItem->setCustomerProfileOid($customer_oid);
    $addWishItem->setMerchantItemOid($first_item_oid);
    $addWishItem->setComments("I really want this for my birthday");
    $addWishItem->setPriority(3); // Priority of wishlist item, 3 being low priority and 5 is high priority.
    $firstCreatedWishItem = $customer_api->insertWishListItem($customer_oid, $addWishItem);

    $addWishItem = new CustomerWishListItem();
    $addWishItem->setCustomerProfileOid($customer_oid);
    $addWishItem->setMerchantItemOid($second_item_oid);
    $addWishItem->setComments("Christmas Idea!");
    $addWishItem->setPriority(5); // Priority of wishlist item, 3 being low priority and 5 is high priority.
    $secondCreatedWishItem = $customer_api->insertWishListItem($customer_oid, $addWishItem);

    // retrieve one wishlist item again
    $firstCreatedWishItemCopy = $customer_api->getCustomerWishListItem($customer_oid, $firstCreatedWishItem->getCustomerWishlistItemOid())->getWishlistItem();
    // retrieve all wishlist items
    $allWishListItems = $customer_api->getCustomerWishList($customer_oid)->getWishlistItems();

    // update an item.
    $secondCreatedWishItem->setPriority(4);
    $updatedSecondWishItem = $customer_api->updateWishListItem($customer_oid, $secondCreatedWishItem->getCustomerWishlistItemOid(), $secondCreatedWishItem);

    // delete a wish list item
    $customer_api->deleteWishListItem($customer_oid, $firstCreatedWishItem->getCustomerWishlistItemOid());

    // Clean up
    deleteSampleCustomer($customer_oid);
    deleteSampleItemByOid($first_item_oid);
    deleteSampleItemByOid($second_item_oid);

} catch (ApiException $e) {
    echo 'An ApiException occurred.  Please review the following error:';
    var_dump($e); // <-- change_me: handle gracefully
    die(1);
}


