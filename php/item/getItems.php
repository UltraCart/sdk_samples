<?php

set_time_limit(3000); // pull all records could take a long time.
ini_set('max_execution_time', 3000);
ini_set('display_errors', 1);

/*
 * This example illustrates how to retrieve items.  When dealing with items, please note that categories are
 * essentially folders to organize and store items.  They are only used for that purpose and play no role in
 * the checkout process or in the storefront display of items.  So you may organize your items as best serves
 * you.  We're often asked why was use the word 'category' instead of 'folder'.   We started down the road of
 * item management 27 years ago with the word 'category', and it's too much trouble to change.  So items are
 * managed by categories, not folders.  But they are folders.  :)
 * The call takes two possible parameters:
 * 1) parentCategoryId: This is a number which uniquely identifies a category in our system.  Not easy to determine.
 * 2) parentCategoryPath: This is the folder path you wish to retrieve, starting with a forward slash "/"
 * If you provide neither of these values, all items are returned.
 */

use ultracart\v2\api\ItemApi;
use ultracart\v2\ApiException;

require_once '../vendor/autoload.php';
require_once '../samples.php';


$item_api = Samples::getItemApi();


/**
 * @throws ApiException
 */
function getItemChunk(ItemApi $item_api, int $offset, int $limit): array
{

    // The real devil in the getItem calls is the expansion, making sure you return everything you need without
    // returning everything since these objects are extremely large.
    // These are the possible expansion values.
    /*
    accounting                      amember                     auto_order                      auto_order.steps
    ccbill                          channel_partner_mappings    chargeback                      checkout
    content                         content.assignments         content.attributes              content.multimedia
    content.multimedia.thumbnails   digital_delivery            ebay                            email_notifications
    enrollment123                   gift_certificate            google_product_search           kit_definition
    identifiers                     instant_payment_notifications   internal                    options
    payment_processing              physical                    pricing                         pricing.tiers
    realtime_pricing                related                     reporting                       restriction
    reviews                         salesforce                  shipping                        shipping.cases
    tax                             third_party_email_marketing variations                      wishlist_member
    shipping.destination_markups
    shipping.destination_restrictions
    shipping.distribution_centers
    shipping.methods
    shipping.package_requirements
     */
    $expand = "kit_definition,options,shipping,tax,variations"; // just some random ones.  contact us if you're unsure

    $parent_category_id = null;
    $parent_category_path = null;
    $_since = null;
    $_sort = null;
    $api_response = $item_api->getItems($parent_category_id, $parent_category_path, $limit, $offset, $_since,
        $_sort, $expand, false);

    if ($api_response->getItems() != null) {
        return $api_response->getItems();
    }
    return [];
}

$items = [];

$iteration = 1;
$offset = 0;
$limit = 200;
$more_records_to_fetch = true;

try {
    while ($more_records_to_fetch) {

        echo "executing iteration " . $iteration . '<br>';

        $chunk_of_orders = getItemChunk($item_api, $offset, $limit);
        $orders = array_merge($items, $chunk_of_orders);
        $offset = $offset + $limit;
        $more_records_to_fetch = count($chunk_of_orders) == $limit;
        $iteration++;
    }
} catch (ApiException $e) {
    echo 'ApiException occurred on iteration ' . $iteration;
    var_dump($e);
    die(1);
}


// this will be verbose...
var_dump($items);
