<?php

use ultracart\v2\api\CouponApi;
use ultracart\v2\models\Coupon;
use ultracart\v2\models\CouponAmountOffSubtotal;

require_once '../vendor/autoload.php';

$coupon_api = CouponApi::usingApiKey(Constants::API_KEY);

$coupon = new Coupon();
$coupon->setMerchantCode('11OFF');
$coupon->setDescription("Eleven dollars off subtotal");

// each coupon must have a 'type' defined by creating a child object directly beneath the main Coupon object.
// this is complex and there are a LOT of coupon types.  See the backend (secure.ultracart.com) coupon screens
// to get an idea of what functionality each coupon possesses.  If you're not sure, contact UltraCart support.
$coupon->setAmountOffSubtotal(new CouponAmountOffSubtotal());
$coupon->getAmountOffSubtotal()->setDiscountAmount(11);

// Here are the different coupon types, but beware that new coupons are added frequently.
//CouponAmountOffItems
//CouponAmountOffShipping
//CouponAmountOffShippingWithItemsPurchase
//CouponAmountOffSubtotal
//CouponAmountOffSubtotalAndShipping
//CouponAmountOffSubtotalFreeShippingWithPurchase
//CouponAmountOffSubtotalWithBlockPurchase
//CouponAmountOffSubtotalWithItemsPurchase
//CouponAmountOffSubtotalWithPurchase
//CouponAmountShippingWithSubtotal
//CouponDiscountItems
//CouponDiscountItemWithItemPurchase
//CouponFreeItemAndShippingWithSubtotal
//CouponFreeItemsWithItemPurchase
//CouponFreeItemsWithMixMatchPurchase
//CouponFreeItemWithItemPurchase
//CouponFreeItemWithItemPurchaseAndFreeShipping
//CouponFreeItemWithSubtotal
//CouponFreeShipping
//CouponFreeShippingSpecificItems
//CouponFreeShippingWithItemsPurchase
//CouponFreeShippingWithSubtotal
//CouponMoreLoyaltyCashback
//CouponMoreLoyaltyPoints
//CouponMultipleAmountsOffItems
//CouponNoDiscount
//CouponPercentMoreLoyaltyCashback
//CouponPercentMoreLoyaltyPoints
//CouponPercentOffItems
//CouponPercentOffItemsAndFreeShipping
//CouponPercentOffItemsWithItemsPurchase
//CouponPercentOffItemWithItemsQuantityPurchase
//CouponPercentOffMsrpItems
//CouponPercentOffRetailPriceItems
//CouponPercentOffShipping
//CouponPercentOffSubtotal
//CouponPercentOffSubtotalAndFreeShipping
//CouponPercentOffSubtotalLimit
//CouponPercentOffSubtotalWithItemsPurchase
//CouponPercentOffSubtotalWithSubtotal
//CouponTieredAmountOffItems
//CouponTieredAmountOffSubtotal
//CouponTieredPercentOffItems
//CouponTieredPercentOffShipping
//CouponTieredPercentOffSubtotal
//CouponTieredPercentOffSubtotalBasedOnMSRP
//CouponTierItemDiscount
//CouponTierPercent
//CouponTierQuantityAmount
//CouponTierQuantityPercent

$_expand = null; // coupons do not have expansions
$api_response = $coupon_api->insertCoupon($coupon, $_expand);
echo '<html lang="en"><body><pre>';
var_dump($api_response);
echo '</pre></body></html>';
