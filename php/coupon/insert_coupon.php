<?php
require_once '../vendor/autoload.php';
$simple_key = '109ee846ee69f50177018ab12f008a00748a25aa28dbdc0177018ab12f008a00';
$coupon_api = ultracart\v2\api\CouponApi::usingApiKey($simple_key, 30, false, false);

$coupon = new \ultracart\v2\models\Coupon();
$coupon->setMerchantCode('11OFF');
$coupon->setDescription("Eleven dollars off subtotal");
// each coupon must have a 'type' defined by creating a child object directly beneath the main Coupon object.
$coupon->setAmountOffSubtotal(new \ultracart\v2\models\CouponAmountOffSubtotal());
$coupon->getAmountOffSubtotal()->setDiscountAmount(11);

$api_response = $coupon_api->insertCoupon($coupon);
echo '<html lang="en"><body><pre>';
var_dump($api_response);
echo '</pre></body></html>';
?>

