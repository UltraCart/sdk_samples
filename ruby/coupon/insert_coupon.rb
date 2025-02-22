require 'ultracart_api'
require_relative '../constants'

# Initialize the coupon API
coupon_api = UltracartClient::CouponApi.new_using_api_key(Constants::API_KEY)

# Create a new coupon
coupon = UltracartClient::Coupon.new
coupon.merchant_code = '11OFF'
coupon.description = 'Eleven dollars off subtotal'

# each coupon must have a 'type' defined by creating a child object directly beneath the main Coupon object.
# this is complex and there are a LOT of coupon types.  See the backend (secure.ultracart.com) coupon screens
# to get an idea of what functionality each coupon possesses.  If you're not sure, contact UltraCart support.
coupon.amount_off_subtotal = UltracartClient::CouponAmountOffSubtotal.new
coupon.amount_off_subtotal.discount_amount = 11

# Here are the different coupon types, but beware that new coupons are added frequently.
#CouponAmountOffItems
#CouponAmountOffShipping
#CouponAmountOffShippingWithItemsPurchase
#CouponAmountOffSubtotal
#CouponAmountOffSubtotalAndShipping
#CouponAmountOffSubtotalFreeShippingWithPurchase
#CouponAmountOffSubtotalWithBlockPurchase
#CouponAmountOffSubtotalWithItemsPurchase
#CouponAmountOffSubtotalWithPurchase
#CouponAmountShippingWithSubtotal
#CouponDiscountItems
#CouponDiscountItemWithItemPurchase
#CouponFreeItemAndShippingWithSubtotal
#CouponFreeItemsWithItemPurchase
#CouponFreeItemsWithMixMatchPurchase
#CouponFreeItemWithItemPurchase
#CouponFreeItemWithItemPurchaseAndFreeShipping
#CouponFreeItemWithSubtotal
#CouponFreeShipping
#CouponFreeShippingSpecificItems
#CouponFreeShippingWithItemsPurchase
#CouponFreeShippingWithSubtotal
#CouponMoreLoyaltyCashback
#CouponMoreLoyaltyPoints
#CouponMultipleAmountsOffItems
#CouponNoDiscount
#CouponPercentMoreLoyaltyCashback
#CouponPercentMoreLoyaltyPoints
#CouponPercentOffItems
#CouponPercentOffItemsAndFreeShipping
#CouponPercentOffItemsWithItemsPurchase
#CouponPercentOffItemWithItemsQuantityPurchase
#CouponPercentOffMsrpItems
#CouponPercentOffRetailPriceItems
#CouponPercentOffShipping
#CouponPercentOffSubtotal
#CouponPercentOffSubtotalAndFreeShipping
#CouponPercentOffSubtotalLimit
#CouponPercentOffSubtotalWithItemsPurchase
#CouponPercentOffSubtotalWithSubtotal
#CouponTieredAmountOffItems
#CouponTieredAmountOffSubtotal
#CouponTieredPercentOffItems
#CouponTieredPercentOffShipping
#CouponTieredPercentOffSubtotal
#CouponTieredPercentOffSubtotalBasedOnMSRP
#CouponTierItemDiscount
#CouponTierPercent
#CouponTierQuantityAmount
#CouponTierQuantityPercent

# coupons do not have expansions
api_response = coupon_api.insert_coupon(coupon, {_expand: nil})
puts api_response