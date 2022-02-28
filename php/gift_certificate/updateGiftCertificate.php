<?php
require_once '../vendor/autoload.php';
require_once '../constants.php';


$gift_certificate_api = ultracart\v2\api\GiftCertificateApi::usingApiKey(Constants::API_KEY, 120, false);

$gift_certificate_oid = 676713;

// by_oid does not take an expansion variable.  it will return the entire object by default.
$api_response = $gift_certificate_api->getGiftCertificateByOid($gift_certificate_oid);
$gift_certificate = $api_response->getGiftCertificate();

$gift_certificate->setEmail("perry@ultracart.com");
$api_response = $gift_certificate_api->updateGiftCertificate($gift_certificate_oid, $gift_certificate);

echo '<html lang="en"><body><pre>';
var_dump($api_response);
var_dump($api_response->getGiftCertificate());
echo '</pre></body></html>';


