<?php

use ultracart\v2\api\CouponApi;

require_once '../vendor/autoload.php';

$coupon_api = CouponApi::usingApiKey(Constants::API_KEY);
$coupon_oid = 123456789;

$_expand = null; // coupons do not have expansions
$api_response = $coupon_api->getCoupon($coupon_oid, $_expand);
$coupon = $api_response->getCoupon();

// update the coupon.  this can be difficult given the complexity of coupons.  see insertCoupon sample for details.
$coupon->setExpirationDts(date('Y-m-d', strtotime('90 days')) . "T00:00:00+00:00");

$api_response = $coupon_api->updateCoupon($coupon_oid, $coupon, $_expand);
$updated_coupon = $api_response->getCoupon();

echo '<html lang="en"><body><pre>';
var_dump($updated_coupon);
echo '</pre></body></html>';
