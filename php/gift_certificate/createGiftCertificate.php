<?php

use ultracart\v2\models\GiftCertificateCreateRequest;

require_once '../vendor/autoload.php';
require_once '../samples.php';

$gift_certificate_api = Samples::getGiftCertificateApi();

$expiration_dts = new DateTime('now');
$expiration_dts->modify('+3 month'); // or you can use '-90 day' for deduct


$gc_create_request = new GiftCertificateCreateRequest();
$gc_create_request->setAmount(150.75);
$gc_create_request->setInitialLedgerDescription("Issued instead of refund");
$gc_create_request->setMerchantNote('Problem Order: blah-12345\nIssued gift certificate due to stale product.\nIssued By: Customer Service Rep Joe Smith');
$gc_create_request->setEmail('support@ultracart.com');
$gc_create_request->setExpirationDts($expiration_dts->format('c'));
$gc_create_request->setMerchantNote("This is my merchant note.");


// create does not take an expansion variable.  it will return the entire object by default.
$api_response = $gift_certificate_api->createGiftCertificate($gc_create_request);

echo '<html lang="en"><body><pre>';
var_dump($api_response);
var_dump($api_response->getGiftCertificate());
echo '</pre></body></html>';


