"""
getAutoApply returns back the items and subtotals that trigger "auto coupons", i.e. coupons that are automatically
added to a shopping cart.  The manual configuration of auto coupons is at the bottom of the main coupons screen.
See: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1376525/Coupons#Coupons-Navigation
"""

from ultracart.apis import CouponApi
from samples import api_client

coupon_api = CouponApi(api_client())
api_response = coupon_api.get_auto_apply()

print('These are the subtotal levels:')
for subtotal_level in api_response.subtotal_levels:
    print(subtotal_level)
    print()

print('These are the item triggers:')
for required_item in api_response.required_items:
    print(required_item)
    print()