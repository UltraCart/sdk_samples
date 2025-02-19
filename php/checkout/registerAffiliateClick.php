<?php /** @noinspection DuplicatedCode */

// Reference Implementation: https://github.com/UltraCart/responsive_checkout
// Records an affiliate click.

use ultracart\v2\models\RegisterAffiliateClickRequest;

require_once '../vendor/autoload.php';
require_once '../constants.php';


$checkout_api = ultracart\v2\api\CheckoutApi::usingApiKey(Constants::API_KEY);

$clickRequest = new RegisterAffiliateClickRequest();
$clickRequest->setIpAddress($_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR']);
$clickRequest->setUserAgent($_SERVER['HTTP_USER_AGENT'] ?? '');
$clickRequest->setReferrerUrl($_SERVER['HTTP_REFERER'] ?? '');
$clickRequest->setAffid(123456789); // you should know this from your UltraCart affiliate system.
$clickRequest->setSubid('TODO:SupplyThisValue');
// $clickRequest->setLandingPageUrl(null);  // if you have landing page url.

$api_response = $checkout_api->registerAffiliateClick($clickRequest);

var_dump($api_response);