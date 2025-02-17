<?php

use ultracart\v2\api\CouponApi;

require_once '../vendor/autoload.php';

$coupon_api = CouponApi::usingApiKey(Constants::API_KEY);
$merchant_code = '10OFF';

$api_response = $coupon_api->doesCouponCodeExist($merchant_code);
$coupon_exists = $api_response->getExists();

echo '<html lang="en"><body><pre>';
var_dump($api_response);
echo '</pre></body></html>';


