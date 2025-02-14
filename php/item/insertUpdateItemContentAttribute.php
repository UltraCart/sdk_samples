<?php

ini_set('display_errors', 1);

/*
    While UltraCart provides a means for updating item content, it is StoreFront specific.  This method allows for
    item-wide update of content, such as SEO fields. The content attribute has three fields:
    1) name
    2) value
    3) type: boolean,color,definitionlist,html,integer,mailinglist,multiline,rgba,simplelist,string,videolist

    The SEO content has the following names:
    Item Meta Title = "storefrontSEOTitle"
    Item Meta Description = "storefrontSEODescription"
    Item Meta Keywords = "storefrontSEOKeywords"

    The merchant_item_oid is a unique identifier used by UltraCart.  If you do not know your item's oid, call
    ItemApi.getItemByMerchantItemId() to retrieve the item, and then it's oid $item->getMerchantItemOid()

    Success will return back a status code of 204 (No Content)

 */


use ultracart\v2\api\ItemApi;

require_once '../vendor/autoload.php';
require_once '../constants.php';


$item_api = ItemApi::usingApiKey(Constants::API_KEY);
$merchant_item_oid = 12345;

$attribute = new \ultracart\v2\models\ItemContentAttribute();
$attribute->setName("storefrontSEOKeywords");
$attribute->setValue('dog,cat,fish');
$attribute->setType("string");

$item_api->insertUpdateItemContentAttribute($merchant_item_oid, $attribute);