<?php

/*
    updateAutoApply updates the items and subtotals conditions that trigger "auto coupons", i.e. coupons that are automatically
    added to a shopping cart.  The manual configuration of auto coupons is at the bottom of the main coupons screen.
    See: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1376525/Coupons#Coupons-Navigation

    // Success is 200 (There is no content.  Yes, this should return a 204, but it returns a 200 with no content)
 */

use ultracart\v2\api\CouponApi;
use ultracart\v2\models\CouponAutoApplyCondition;
use ultracart\v2\models\CouponAutoApplyConditions;

require_once '../vendor/autoload.php';

$coupon_api = CouponApi::usingApiKey(Constants::API_KEY);


$autoApply = new CouponAutoApplyConditions();

$itemCondition = new CouponAutoApplyCondition();
$itemCondition->setRequiredItemId('ITEM_ABC');
$itemCondition->setCouponCode('10OFF');
$itemConditions = [$itemCondition];

$subtotalCondition = new CouponAutoApplyCondition();
$subtotalCondition->setMinimumSubtotal(50); // must spend fifty dollars
$itemCondition->setCouponCode('5OFF');
$subtotalConditions = [$subtotalCondition];

$autoApply->setRequiredItems($itemConditions);
$autoApply->setSubtotalLevels($subtotalConditions);


$coupon_api->updateAutoApply($autoApply);

