<?php

/*
    Similar to insertCoupon except this method takes a request object containing up to 50 coupons.  Please see
    insertCoupon for a detailed example on creating a coupon.  It is not repeated here.
 */

use ultracart\v2\api\CouponApi;
use ultracart\v2\models\Coupon;
use ultracart\v2\models\CouponsRequest;

require_once '../vendor/autoload.php';

$coupon_api = CouponApi::usingApiKey(Constants::API_KEY);

$couponsRequest = new CouponsRequest();
$coupons = [];
// TODO: add Coupons() to this array (see insertCoupon sample for help)
$couponsRequest->setCoupons($coupons);
$_expand = null; // coupons do not have expansions
$_placeholders = null; // coupons do not have placeholders.

$api_response = $coupon_api->insertCoupons($couponsRequest, $_expand, $_placeholders);
echo '<html lang="en"><body><pre>';
var_dump($api_response);
echo '</pre></body></html>';
