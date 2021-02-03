<?php
// Create a Simple Key: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/38688545/API+Simple+Key
// Error help: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/39077885/Troubleshooting+API+Errors
// Additional Docs: https://www.ultracart.com/api/#introduction.html

require_once '../vendor/autoload.php';
$simple_key = '109ee846ee69f50177018ab12f008a00748a25aa28dbdc0177018ab12f008a00';
$api = ultracart\v2\api\CouponApi::usingApiKey($simple_key, 30, false);
?>

<?php
/**
 * returns a block of customers
 * @param \ultracart\v2\api\CouponApi $api
 * @param int $offset pagination variable
 * @param int $limit pagination variable.  max server will allow is 200
 * @return array|\ultracart\v2\models\Customer[]
 * @throws \ultracart\v2\ApiException
 */
function get_coupons_chunk(\ultracart\v2\api\CouponApi $api, int $offset = 0, int $limit = 200) {

    $_limit = $limit;
    $_offset = $offset;
    $_since = null;
    $_sort = null;
    $_expand = null; // getCoupons doesn't have any expansions.  full record is always returned.

    $get_response = $api->getCoupons(null, null, null, null, null, null, null, null, null, $_limit, $_offset, $_sort, $_expand);
    if($get_response->getSuccess()){
        return $get_response->getCoupons();
    }

    return array();
}
?>

<html>
<body>

<?php
$coupons = array();
try {

    $iteration = 1;
    $offset = 0;
    $limit = 200;  // I'm testing the rate limiter headers.  this is usually about 200.  If I forget, change it back.
    $need_more_records = true;
    while($need_more_records){

        echo "executing iteration #" . $iteration++ . "<br>";
        $block_of_customers = get_coupons_chunk($api, $offset, $limit);
        foreach($block_of_customers as $coupon){
            array_push($coupons, $coupon);
        }

        $offset += $limit;
        $need_more_records = count($block_of_customers) == $limit;
        // sleep(1);  // I'm testing rate limiter headers.  this should probably be uncommented.  maybe.
    }

} catch (\ultracart\v2\ApiException $e) {
    echo 'API Exception when calling CouponApi->getCoupons: ', $e->getMessage(), PHP_EOL;
    echo print_r($e->getResponseBody()), PHP_EOL;
} catch (Exception $e) {
    echo 'Exception when calling CouponApi->getCoupons: ', $e->getMessage(), PHP_EOL;
}

echo '<pre>';
var_dump($coupons);
echo '</pre>';

?>
</body>
</html>
