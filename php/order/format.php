<?php

ini_set('display_errors', 1);

/*
 * format() returns back a text-formatted or html block for displaying an order.  It is similar to what you would
 * see on a receipt page.
 */

use ultracart\v2\api\OrderApi;
use ultracart\v2\models\OrderFormat;

require_once '../vendor/autoload.php';
require_once '../constants.php';


$order_api = OrderApi::usingApiKey(Constants::API_KEY);


$format_options = new OrderFormat();
$format_options->setContext('receipt'); // unknown,receipt,shipment,refund,quote-request,quote
$format_options->setFormat('table'); // text,div,table,email
$format_options->setShowContactInfo(false);
$format_options->setShowPaymentInfo(false); // might not want to show this to just anyone.
$format_options->setShowMerchantNotes(false); // be careful showing these
$format_options->setEmailAsLink(true); // makes the email addresses web links
// if you only wish to show the items for a particular distribution center,
// this might be useful if you have setContext('shipment') and you're displaying this order to a fulfillment center, etc
// $format_options->setFilterDistributionCenterOid(1234321);
$format_options->setLinkFileAttachments(true);
$format_options->setShowInternalInformation(true); // consider this carefully.
$format_options->setShowNonSensitivePaymentInfo(true); // what the customer usually sees
$format_options->setShowInMerchantCurrency(true);
$format_options->setHideBillToAddress(false);
// $format_options->setFilterToItemsInContainerOid(123454321); // you probably won't need this.
// when an order displays on the secure.ultracart.com site, we link the email to our order search so you can quickly
// search for all orders for that email.  I doubt you would have use for that.  But maybe.
$format_options->setDontLinkEmailToSearch(true);
$format_options->setTranslate(false); // if true, shows in customer's native language


$order_id = 'DEMO-0009104390';


$api_response = $order_api->format($order_id, $format_options);

if (!$api_response->valid()) {
    error_log($api_response->getError()->getDeveloperMessage());
    error_log($api_response->getError()->getUserMessage());
    exit();
}

$formatted_result = $api_response->getFormattedResult();
echo '<html lang="en">';
echo '<head>';
// you won't have css links for format=table
foreach($api_response->getCssLinks() as $link){
    echo '<style type="text/css">' . $link . '</style>';
}
echo '</head><body>';
echo $formatted_result;
echo '</body></html>';
