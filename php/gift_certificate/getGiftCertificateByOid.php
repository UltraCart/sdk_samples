<?php
require_once '../vendor/autoload.php';
require_once '../samples.php';

$gift_certificate_api = Samples::getGiftCertificateApi();

$gift_certificate_oid = 676713;

// by_oid does not take an expansion variable.  it will return the entire object by default.
$api_response = $gift_certificate_api->getGiftCertificateByOid($gift_certificate_oid);


echo '<html lang="en"><body><pre>';
var_dump($api_response);
var_dump($api_response->getGiftCertificate());
echo '</pre></body></html>';


