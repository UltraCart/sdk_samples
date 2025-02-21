from ultracart.apis import CouponApi
from ultracart.models import Coupon, CouponAmountOffSubtotal
from samples import api_client

# Initialize the API
coupon_api = CouponApi(api_client())

# Create the main coupon object
coupon = Coupon()
coupon.merchant_code = '11OFF'
coupon.description = "Eleven dollars off subtotal"

# Each coupon must have a 'type' defined by creating a child object directly beneath the main Coupon object.
# This is complex and there are a LOT of coupon types. See the backend (secure.ultracart.com) coupon screens
# to get an idea of what functionality each coupon possesses. If you're not sure, contact UltraCart support.
coupon.amount_off_subtotal = CouponAmountOffSubtotal()
coupon.amount_off_subtotal.discount_amount = 11

# Here are the different coupon types, but beware that new coupons are added frequently.
# CouponAmountOffItems
# CouponAmountOffShipping
# CouponAmountOffShippingWithItemsPurchase
# CouponAmountOffSubtotal
# CouponAmountOffSubtotalAndShipping
# CouponAmountOffSubtotalFreeShippingWithPurchase
# CouponAmountOffSubtotalWithBlockPurchase
# CouponAmountOffSubtotalWithItemsPurchase
# CouponAmountOffSubtotalWithPurchase
# CouponAmountShippingWithSubtotal
# CouponDiscountItems
# CouponDiscountItemWithItemPurchase
# CouponFreeItemAndShippingWithSubtotal
# CouponFreeItemsWithItemPurchase
# CouponFreeItemsWithMixMatchPurchase
# CouponFreeItemWithItemPurchase
# CouponFreeItemWithItemPurchaseAndFreeShipping
# CouponFreeItemWithSubtotal
# CouponFreeShipping
# CouponFreeShippingSpecificItems
# CouponFreeShippingWithItemsPurchase
# CouponFreeShippingWithSubtotal
# CouponMoreLoyaltyCashback
# CouponMoreLoyaltyPoints
# CouponMultipleAmountsOffItems
# CouponNoDiscount
# CouponPercentMoreLoyaltyCashback
# CouponPercentMoreLoyaltyPoints
# CouponPercentOffItems
# CouponPercentOffItemsAndFreeShipping
# CouponPercentOffItemsWithItemsPurchase
# CouponPercentOffItemWithItemsQuantityPurchase
# CouponPercentOffMsrpItems
# CouponPercentOffRetailPriceItems
# CouponPercentOffShipping
# CouponPercentOffSubtotal
# CouponPercentOffSubtotalAndFreeShipping
# CouponPercentOffSubtotalLimit
# CouponPercentOffSubtotalWithItemsPurchase
# CouponPercentOffSubtotalWithSubtotal
# CouponTieredAmountOffItems
# CouponTieredAmountOffSubtotal
# CouponTieredPercentOffItems
# CouponTieredPercentOffShipping
# CouponTieredPercentOffSubtotal
# CouponTieredPercentOffSubtotalBasedOnMSRP
# CouponTierItemDiscount
# CouponTierPercent
# CouponTierQuantityAmount
# CouponTierQuantityPercent

expand = None  # coupons do not have expansions
api_response = coupon_api.insert_coupon(coupon, expand=expand)
print(api_response)