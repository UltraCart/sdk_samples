<?php

/*

uploadCouponCodes allows a merchant to upload one-time use codes and associate them with a merchant code (i.e. a coupon).
UltraCart has methods for generating one-time codes, and they work well, but this method exists when the merchant generates
them themselves.  This frequently occurs when a merchant sends out a mailer with unique coupon codes on the mailer.  The
merchant can then upload those codes with this method.

 */

use ultracart\v2\api\CouponApi;
use ultracart\v2\models\UploadCouponCodesRequest;


require_once '../vendor/autoload.php';

$coupon_api = CouponApi::usingApiKey(Constants::API_KEY);
$coupon_oid = 12345678;  // if you don't know your coupon_oid, use generateOneTimeCodesByMerchantCode.  same results

$codesRequest = new UploadCouponCodesRequest();
$codesRequest->setCouponCodes(['code1', 'code2', 'code3']);

$api_response =  $coupon_api->uploadCouponCodes($coupon_oid, $codesRequest);
echo 'Uploaded codes:<br>';
var_dump($api_response->getUploadedCodes());
echo 'Duplicated codes:<br>';
var_dump($api_response->getDuplicateCodes());
echo 'Rejected codes:<br>';
var_dump($api_response->getRejectedCodes());
