<?php

use ultracart\v2\api\CouponApi;
use ultracart\v2\models\CouponCodesRequest;

require_once '../vendor/autoload.php';

$coupon_api = CouponApi::usingApiKey(Constants::API_KEY);
$coupon_oid = 12345678;  // if you don't know your coupon_oid, use generateOneTimeCodesByMerchantCode.  same results

$codesRequest = new CouponCodesRequest();
$codesRequest->setQuantity(100); // give me 100 codes.
$codesRequest->setExpirationDts(date('Y-m-d', strtotime('90 days')) . "T00:00:00+00:00"); // do you want the codes to expire?
// $codesRequest->setExpirationSeconds(); // also an option for short-lived coupons

$api_response =  $coupon_api->generateCouponCodes($coupon_oid, $codesRequest);
$coupon_codes = $api_response->getCouponCodes();

