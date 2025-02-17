<?php

use ultracart\v2\api\CouponApi;

require_once '../vendor/autoload.php';

$coupon_api = CouponApi::usingApiKey(Constants::API_KEY);
$coupon_oid = 123456789;

$_expand = null; // coupons do not have expansions
$api_response = $coupon_api->getCoupon($coupon_oid, $_expand);

echo '<html lang="en"><body><pre>';
var_dump($api_response);
echo '</pre></body></html>';


