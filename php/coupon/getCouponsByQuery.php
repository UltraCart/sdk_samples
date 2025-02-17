<?php

set_time_limit(3000); // pull all orders could take a long time.
ini_set('max_execution_time', 3000);
ini_set('display_errors', 1);

/*
retrieves coupons by query.  Can filter on specific coupons or return back all coupons.  Support pagination.
A note about the coupon type below.  Those are string literals representing coupons.  This method is used UltraCart's
backend, and it uses a dropdown box for that value showing friendly descriptions of them.

It's not anticipated a merchant would need to query by coupon type, but in the event you do, here's the list of constants:
"BOGO limit L"
"Free shipping method Y"
"Free shipping method Y with purchase of items Z"
"Free shipping method Y with subtotal Z"
"Free shipping on item Z"
"Free X with purchase of Y dollars limit L"
"Free X with purchase of Y dollars limit L and shipping Z"
"Free X with purchase of Y limit L"
"Free X with purchase of Y limit L and free shipping"
"I Free X with every J purchase of Y limit L"
"I Free X with every J purchase of Y mix and match group limit L"
"Item X for Y with purchase of Z limit L"
"multiple X $ off item Z limit L"
"No discount"
"Tiered Dollar Off Subtotal"
"Tiered % off items Z limit L"
"Tiered $ off item Z limit L"
"Tiered Percent off shipping methods Y with subtotal Z"
"Tiered Percent Off Subtotal"
"X dollars off shipping method Y with purchase of items Z"
"X dollars off subtotal with purchase Y items"
"X $ for item Z limit L"
"X more loyalty cashback"
"X more loyalty points"
"X % off item Z and free shipping"
"X $ off item Z limit L"
"X % off item Z limit L"
"X % off msrp item Z limit L"
"X % off retail item Z limit L"
"X $ off shipping method Y"
"X % off shipping method Y"
"X $ off subtotal"
"X % off subtotal"
"X $ off subtotal and shipping"
"X % off subtotal free shipping method Y"
"X % off subtotal limit L"
"X off subtotal with purchase block of L item Y"
"X % off subtotal with purchase of item Y"
"X % off subtotal with purchase of Y"
"X $ off subtotal with Y $ purchase"
"X $ off subtotal with Y $ purchase and free shipping"
"X % off Y with purchase Z limit L"
"X % off Y with T purchase Z limit L"
"X percent more loyalty points"
"X $ shipping method Y with subtotal Z"
"X ? subtotal"
 */

use ultracart\v2\api\CouponApi;
use ultracart\v2\models\CouponQuery;

require_once '../vendor/autoload.php';
require_once '../constants.php';


$coupon_api = CouponApi::usingApiKey(Constants::API_KEY);


function getCouponChunk(CouponApi $coupon_api, int $offset, int $limit): array
{

    $query = new CouponQuery();
    $query->setMerchantCode('10OFF'); // supports partial matching
    $query->setDescription('Saturday'); // supports partial matching
    // $query->setCouponType(); // see the note at the top of this sample.
    // $query->setStartDtsBegin(date('Y-m-d', strtotime('-2000 days')) . "T00:00:00+00:00"); // yes, that 2,000 days.
    // $query->setStartDtsEnd(date('Y-m-d', time()) . "T00:00:00+00:00");
    // $query->setExpirationDtsBegin();
    // $query->setExpirationDtsEnd();
    // $query->setAffiliateOid(); // this requires an affiliate_oid.  If you need help finding an affiliate's oid, contact support.
    $query->setExcludeExpired(true);

    $_expand = null; // coupons do not have expansions
    $_sort = "merchant_code"; // Possible sorts: "coupon_type", "merchant_code", "description", "start_dts", "expiration_dts", "quickbooks_code"

    $api_response = $coupon_api->getCouponsByQuery($query, $limit, $offset, $_sort, $_expand);
    if($api_response->getCoupons() != null){
        return $api_response->getCoupons();
    }
    return [];
}

$coupons = [];

$iteration = 1;
$offset = 0;
$limit = 200;
$more_records_to_fetch = true;

while( $more_records_to_fetch ){

    echo "executing iteration " . $iteration . '<br>';
    $chunk_of_coupons = getCouponChunk($coupon_api, $offset, $limit);
    $coupons = array_merge($coupons, $chunk_of_coupons);
    $offset = $offset + $limit;
    $more_records_to_fetch = count($chunk_of_coupons) == $limit;
    $iteration++;

}

// this could get verbose...
echo '<html lang="en"><body><pre>';
var_dump($coupons);
echo '</pre></body></html>';
