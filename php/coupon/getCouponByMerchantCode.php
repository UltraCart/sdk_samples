<?php

use ultracart\v2\api\CouponApi;

require_once '../vendor/autoload.php';

$coupon_api = CouponApi::usingApiKey(Constants::API_KEY);
$api_response = $coupon_api->getCouponByMerchantCode('10OFF');

echo '<html lang="en"><body><pre>';
var_dump($api_response);
echo '</pre></body></html>';


