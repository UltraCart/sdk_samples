<?php

use ultracart\v2\api\CouponApi;
use ultracart\v2\models\CouponDeletesRequest;

require_once '../vendor/autoload.php';

$coupon_api = CouponApi::usingApiKey(Constants::API_KEY);
$merchant_code = '10OFF';
$deleteRequest = new CouponDeletesRequest();
$deleteRequest->setCouponCodes([$merchant_code]);

$coupon_api->deleteCouponsByCode($deleteRequest);