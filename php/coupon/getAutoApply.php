<?php

/*
    getAutoApply returns back the items and subtotals that trigger "auto coupons", i.e. coupons that are automatically
    added to a shopping cart.  The manual configuration of auto coupons is at the bottom of the main coupons screen.
    See: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1376525/Coupons#Coupons-Navigation

 */

use ultracart\v2\api\CouponApi;

require_once '../vendor/autoload.php';

$coupon_api = CouponApi::usingApiKey(Constants::API_KEY);
$api_response =  $coupon_api->getAutoApply();
echo 'These are the subtotal levels:<br>';
foreach ($api_response->getSubtotalLevels() as $subtotalLevel) {
    var_dump($subtotalLevel);
    echo '<br>';
}
echo 'These are the item triggers:<br>';
foreach ($api_response->getRequiredItems() as $requiredItem) {
    var_dump($requiredItem);
    echo '<br>';
}


