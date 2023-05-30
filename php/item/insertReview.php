<?php
/** @noinspection SpellCheckingInspection */
/** @noinspection GrazieInspection */

use ultracart\v2\ApiException;

require_once '../vendor/autoload.php';
require_once '../samples.php';
require_once './item_functions.php'; // <-- see this file for details


try {

    // To insert a review, you'll need an item's OID (Object Identifier) first.  So for this example, we create
    // a sample item first, then retrieve it by item id to fetch the item oid.

    echo '<pre>';
    $item_id = insertSampleItem();
    echo '</pre>';
    $item_api = Samples::getItemApi(); // convenience fuction for getting an api handle.

    $expand = 'reviews'; // expand string is 'reviews' because we'll need to update the sample item's review template below.
    // list of expansions for item object: https://www.ultracart.com/api/#resource_item.html

    $item_response = $item_api->getItemByMerchantItemId($item_id, $expand, null);
    $item = $item_response->getItem();
    $item_oid = $item->getMerchantItemOid();

    // The target item must have a review template associated before you may attach a review.
    // You may create a review template here:
    // https://secure.ultracart.com/merchant/item/review/reviewTemplateListLoad.do
    // We're using a review template from our development system and it will not work for you.
    // Once you have a review template, update your item either via our gui or the rest api.
    // GUI: secure.ultracart.com -> Home -> Items -> <your item> -> Edit -> Review tab
    // Since we're using a sample item we just created above (line 17), we'll update via the rest api.
    // The rest api requires the review template oid, which is found on the template screen (url on line 25 above)

    $review_template_oid = 402;
    $reviews = new ultracart\v2\models\ItemReviews();
    $reviews->setReviewTemplateOid($review_template_oid);
    $item->setReviews($reviews);
    $item = $item_api->updateItem($item_oid, $item, $expand, null)->getItem();


    // You will need to know what your
    $review = new ultracart\v2\models\ItemReview();
    $review->setTitle('Best Product Ever!');
    $review->setReview("I loved this product.  I bought it for my wife and she was so happy she cried.  blah blah blah");
    $review->setReviewedNickname("Bob420");
    $review->setFeatured(true); // featured? sure. why not? this is a great review.
    $review->setRatingName1('Durability');
    $review->setRatingName2('Price');
    $review->setRatingName3('Performance');
    $review->setRatingName4('Appearance');
    $review->setRatingScore1(4.5);
    $review->setRatingScore2(3.5);
    $review->setRatingScore3(2.5);
    $review->setRatingScore4(1.5);
    $review->setOverall(5.0); // hooray!
    $review->setReviewerLocation("Southside Chicago");
    $review->setStatus('approved');
    // insert the review and update our local variable to see how the review looks now.
    $review = $item_api->insertReview($item_oid, $review)->getReview();

    echo '<br>This is my review object:<br><pre>';
    var_dump($review);
    echo '</pre>';

    // This will clean up the sample item, but you may wish to review the item in the backend or on your website first.
    // deleteSampleItem($item_id);

} catch (ApiException $e) {
    echo 'An ApiException occurred.  Please review the following error:';
    var_dump($e); // <-- change_me: handle gracefully
    die(1);
}
