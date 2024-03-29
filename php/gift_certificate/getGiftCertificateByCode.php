<?php
require_once '../vendor/autoload.php';
require_once '../samples.php';

$gift_certificate_api = Samples::getGiftCertificateApi();
/** @noinspection SpellCheckingInspection */ $code = "93KHHXD6VH";

// by_code does not take an expansion variable.  it will return the entire object by default.
$api_response = $gift_certificate_api->getGiftCertificateByCode($code);


echo '<html lang="en"><body><pre>';
var_dump($api_response);
var_dump($api_response->getGiftCertificate());
echo '</pre></body></html>';


