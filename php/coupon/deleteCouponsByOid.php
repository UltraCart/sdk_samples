<?php

use ultracart\v2\api\CouponApi;
use ultracart\v2\models\CouponDeletesRequest;

require_once '../vendor/autoload.php';

// This method is useful if you have the coupons stored in your own system along with their coupon_oids.  If not,
// just use deleteCouponsByCode()

$coupon_api = CouponApi::usingApiKey(Constants::API_KEY);
$deleteRequest = new CouponDeletesRequest();
$deleteRequest->setCouponOids([1234567, 2345678, 3456789]);

$coupon_api->deleteCouponsByOid($deleteRequest);