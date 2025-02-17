<?php
// Create a Simple Key: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/38688545/API+Simple+Key
// Error help: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/39077885/Troubleshooting+API+Errors
// Additional Docs: https://www.ultracart.com/api/#introduction.html

// This is an old example.  Please see getCouponsByQuery as they do essentially the same thing, but 
// getCouponsByQuery is easier to use.

use ultracart\v2\api\CouponApi;
use ultracart\v2\ApiException;
use ultracart\v2\models\Coupon;

require_once '../vendor/autoload.php';
$coupon_api = ultracart\v2\api\CouponApi::usingApiKey(Constants::API_KEY);
?>

<?php
/**
 * returns a block of customers
 * @param CouponApi $coupon_api
 * @param int $offset pagination variable
 * @param int $limit pagination variable.  max server will allow is 200
 * @return array|Coupon[]
 * @throws ApiException
 */
function get_coupons_chunk(CouponApi $coupon_api, int $offset = 0, int $limit = 200) {
    
    // TODO: consider using getCouponsByQuery() as it does not require all search parameters
    $merchant_code = null;
    $description = null;
    $coupon_type = null;
    $start_date_begin = null;
    $start_date_end = null;
    $expiration_date_begin = null;
    $expiration_date_end = null;
    $affiliate_oid = null;
    $exclude_expired = null;
    
    $_limit = $limit;
    $_offset = $offset;
    $_sort = null;
    $_expand = null; // getCoupons doesn't have any expansions.  full record is always returned.

    $get_response = $coupon_api->getCoupons($merchant_code, $description, $coupon_type, $start_date_begin, $start_date_end, $expiration_date_begin, $expiration_date_end, $affiliate_oid, $exclude_expired, $_limit, $_offset, $_sort, $_expand);
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
    $limit = 200;  
    $need_more_records = true;
    while($need_more_records){

        echo "executing iteration #" . $iteration++ . "<br>";
        $block_of_customers = get_coupons_chunk($coupon_api, $offset, $limit);
        foreach($block_of_customers as $coupon){
            $coupons[] = $coupon;
        }

        $offset += $limit;
        $need_more_records = count($block_of_customers) == $limit;
        // sleep(1);  // I'm testing rate limiter headers.  this should probably be uncommented.  maybe.
    }

} catch (ApiException $e) {
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
