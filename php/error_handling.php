<?php
// Did you get an error? See this: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/39077885/Troubleshooting+API+Errors
?>
<?php
// initialization code
$method = 'CouponApi->getCoupon';
require_once './vendor/autoload.php';
$simple_key = '109ee846ee69f50177018ab12f008a00748a25aa28dbdc0177018ab12f008a00';
$coupon_api = ultracart\v2\api\CouponApi::usingApiKey($simple_key, 30, false, false);
?>

<html>
<body>

<?php
try {

    $coupon = $coupon_api->getCouponByMerchantCode('10OFF');

} catch (\ultracart\v2\ApiException $e) {
    echo 'API Exception when calling ' . $method . ': ', $e->getMessage(), PHP_EOL;
    echo print_r($e->getResponseBody()), PHP_EOL;
} catch (Exception $e) {
    echo 'Exception when calling ' . $method . ': ', $e->getMessage(), PHP_EOL;
}

if(isset($coupon)) {
    echo '<pre>';
    var_dump($coupon);
    echo '</pre>';
}
?>
</body>
</html>
