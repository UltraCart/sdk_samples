<?php

use ultracart\v2\api\CouponApi;
use ultracart\v2\models\CouponsRequest;

require_once '../vendor/autoload.php';

$coupon_api = CouponApi::usingApiKey(Constants::API_KEY);
$coupon_oid = 123456789;

$_expand = null; // coupons do not have expansions
$_placeholders = null; // coupons do not use placeholders

$api_response = $coupon_api->getCoupon($coupon_oid, $_expand);
$coupon = $api_response->getCoupon();

// update the coupon.  this can be difficult given the complexity of coupons.  see insertCoupon sample for details.
$coupon->setExpirationDts(date('Y-m-d', strtotime('90 days')) . "T00:00:00+00:00");

// This example only has one coupon.  But it's a trivial matter to add more coupons
$coupons_request = new CouponsRequest();
$coupons_request->setCoupons([$coupon]);

$api_response = $coupon_api->updateCoupons($coupons_request, $_expand, $_placeholders);
$updated_coupons = $api_response->getCoupons();

echo '<html lang="en"><body><pre>';
var_dump($updated_coupons);
echo '</pre></body></html>';
