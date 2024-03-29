<?php
require_once '../vendor/autoload.php';
require_once '../samples.php';

$gift_certificate_api = Samples::getGiftCertificateApi();

$email = "support@ultracart.com";

// by_email does not take an expansion variable.  it will return the entire object by default.
$api_response = $gift_certificate_api->getGiftCertificatesByEmail($email);


echo '<html lang="en"><body><pre>';
var_dump($api_response);
var_dump($api_response->getGiftCertificates());
echo '</pre></body></html>';


