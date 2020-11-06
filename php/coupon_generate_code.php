<?php /* docs.ultracart.com sample */ ?>
<?php // https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/55574541/PHP+SDK+Sample+Add+item+to+order ?>
<?php
// Did you get an error?
// See this: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/39077885/Troubleshooting+API+Errors
?>

<?php
// for testing and development only
set_time_limit(3000);
ini_set('max_execution_time', 3000);
ini_set('display_errors', 1);
error_reporting(E_ALL);
?>

<?php
// initialization code
require_once './vendor/autoload.php';
$simple_key = "508052342b482a015d85c69048030a0005a9da7cea5afe015d85c69048030a00";
ultracart\v2\Configuration::getDefaultConfiguration()->setApiKey('x-ultracart-simple-key', $simple_key);

$client = new GuzzleHttp\Client(['verify' => true, 'debug' => false]);
$config = ultracart\v2\Configuration::getDefaultConfiguration();
$headerSelector = new \ultracart\v2\HeaderSelector(/* leave null for version tied to this sdk version */);

$coupon_api = new ultracart\v2\api\CouponApi($client, $config, $headerSelector);
?>

<?php

function die_if_api_error(\ultracart\v2\models\CouponCodesResponse $coupon_response)
{
    if ($coupon_response->getError() != null) {
        echo "Error:<br>";
        echo $coupon_response->getError()->getDeveloperMessage() . '<br>';
        echo $coupon_response->getError()->getUserMessage() . '<br>';
        die('handle this error gracefully');
    }
}

?>

<!DOCTYPE html>
<html>
<body>
<?php


try {

    $coupon_merchant_code = "10OFF";

    $codes_request = new \ultracart\v2\models\CouponCodesRequest();
    $codes_request->setExpirationSeconds(18000);
    $codes_request->setQuantity(1);

    $codes_response = $coupon_api->generateOneTimeCodesByMerchantCode($coupon_merchant_code, $codes_request);

    die_if_api_error($codes_response);

    $one_time_code = $codes_response->getCouponCodes()[0];
    $expiration_dts = $codes_response->getExpirationDts();

    echo "-----------------------------------------";
    echo "<pre>";
    echo "ONE TIME CODE: " . $one_time_code . "<br>";
    echo "Expiration Dts: " . $expiration_dts . "<br>";
    echo "</pre>";
    echo "-----------------------------------------";

} catch (\ultracart\v2\ApiException $e) {
    echo 'API Exception when calling CouponAPI: ', $e->getMessage(), PHP_EOL;
    echo print_r($e->getResponseBody()), PHP_EOL;
} catch (Exception $e) {
    echo 'Exception when calling CouponAPI: ', $e->getMessage(), PHP_EOL;
}

?>
</body>
</html>

