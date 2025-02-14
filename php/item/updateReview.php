<?php
/** @noinspection SpellCheckingInspection */
/** @noinspection GrazieInspection */

use ultracart\v2\ApiException;

require_once '../vendor/autoload.php';
require_once '../samples.php';
require_once './item_functions.php'; // <-- see this file for details


try {

    // To update a review, you'll need an item's OID (Object Identifier) and the review oid first.

    $merchant_item_oid = 99998888; // if you don't know your oid, call getItemByMerchantItemId() to get your item, then get the oid.
    $review_oid = 123456; // this is the particular oid you wish to update.

    $item_api = Samples::getItemApi(); // convenience fuction for getting an api handle.
    $review = $item_api->getReview($merchant_item_oid, $review_oid);

    // You will need to know what your product review looks like.
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
    $review = $item_api->updateReview($review_oid, $merchant_item_oid, $review)->getReview();

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
