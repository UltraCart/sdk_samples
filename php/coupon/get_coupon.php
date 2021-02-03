<?php
require_once '../vendor/autoload.php';
$simple_key = '109ee846ee69f50177018ab12f008a00748a25aa28dbdc0177018ab12f008a00';
$coupon_api = ultracart\v2\api\CouponApi::usingApiKey($simple_key);
$api_response = $coupon_api->getCouponByMerchantCode('10OFF');
echo '<html lang="en"><body><pre>';
var_dump($api_response);
// var_dump($api_response->getCoupon());
echo '</pre></body></html>';
?>

