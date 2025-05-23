<?php
/** @noinspection SpellCheckingInspection */
/** @noinspection GrazieInspection */

use ultracart\v2\ApiException;

require_once '../vendor/autoload.php';
require_once '../samples.php';
require_once './item_functions.php'; // <-- see this file for details

// Of the two getItem methods, you'll probably always use getItemByMerchantItemId instead of this one.
// Most item work is done with the item id, not the item oid.   The latter is only meaningful as a primary
// key in the UltraCart databases.  But here is an example of using getItem().  We take the long route here
// of retrieving the item using getItemByMerchantItemId to obtain the oid rather than hard-coding it.  We do this
// because these samples are used in our quality control system and run repeatedly.

try {

    $item_id = insertSampleItem();
    $item_api = Samples::getItemApi();
    $customer_api = Samples::getCustomerApi(); // only needed for accessing reviewer information below.

    // the _expand variable is null in the following call.  we just need the base object this time.
    $api_response = $item_api->getItemByMerchantItemId($item_id, null, false);
    $item = $api_response->getItem(); // assuming this succeeded

    $merchant_item_oid = $item->getMerchantItemOid();

    // This is the actual call for this script.
    // The real devil in the getItem calls is the expansion, making sure you return everything you need without
    // returning everything since these objects are extremely large.
    // These are the possible expansion values.
    /*
        accounting
        amember
        auto_order
        auto_order.steps
        ccbill
        channel_partner_mappings
        chargeback
        checkout
        content
        content.assignments
        content.attributes
        content.multimedia
        content.multimedia.thumbnails
        digital_delivery
        ebay
        email_notifications
        enrollment123
        gift_certificate
        google_product_search
        kit_definition
        identifiers
        instant_payment_notifications
        internal
        options
        payment_processing
        physical
        pricing
        pricing.tiers
        realtime_pricing
        related
        reporting
        restriction
        reviews
        reviews.individual_reviews
        salesforce
        shipping
        shipping.cases
        shipping.destination_markups
        shipping.destination_restrictions
        shipping.distribution_centers
        shipping.methods
        shipping.package_requirements
        tax
        third_party_email_marketing
        variations
        wishlist_member
     */
    // $expand = "kit_definition,options,shipping,tax,variations"; // just some random ones.  contact us if you're unsure
    $expand = "reviews,reviews.individual_reviews";  // changed the random above to reviews to illustrate accessing product reviews.
    $api_response = $item_api->getItem($merchant_item_oid, $expand, false);
    $item = $api_response->getItem();

    $item_reviews = $item->getReviews();
    $individual_reviews = $item_reviews->getIndividualReviews();
    // do whatever you wish with the reviews.  iterate them, print them, etc.
    // if you need the reviewer information
    foreach ($individual_reviews as $individual_review) {

        // if you need reviewer profile questions, such as "How often do you use this product?", access the
        // rating names and scores.  these are configurable by merchant, so we do not know what your questions may be.
        // See Home -> Configuration -> Items -> Reviews -> Settings
        // Or this URL: https://secure.ultracart.com/merchant/item/review/reviewSettingsLoad.do
        $individual_review->getRatingName1(); // <-- this will not be the full question, but a key string.
        $individual_review->getRatingScore1();

        // if you need the review information, access that via their customer object.  Be careful.  This can result
        // in a LOT of API calls and exhaust your limit.  You may wish to add 'sleep' calls to your loop and cache
        // these results daily or weekly.
        $customer_response = $customer_api->getCustomer($individual_review->getCustomerProfileOid(), "reviewer");
        $customer = $customer_response->getCustomer();
        $reviewer = $customer->getReviewer();
    }

    echo 'The following item was retrieved via getItem():';
    var_dump($item);

    deleteSampleItem($item_oid);

} catch (ApiException $e) {
    echo 'An ApiException occurred.  Please review the following error:';
    var_dump($e); // <-- change_me: handle gracefully
    die(1);
}


