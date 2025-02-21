from ultracart.apis import CouponApi
from ultracart.models import CouponsRequest
from samples import api_client

"""
Similar to insert_coupon except this method takes a request object containing up to 50 coupons.
Please see insert_coupon for a detailed example on creating a coupon. It is not repeated here.
"""

# Initialize the API
coupon_api = CouponApi(api_client())

# Create the request object
coupons_request = CouponsRequest()
coupons = []
# TODO: add Coupon() objects to this list (see insert_coupon sample for help)
coupons_request.coupons = coupons

expand = None  # coupons do not have expansions
placeholders = None  # coupons do not have placeholders

api_response = coupon_api.insert_coupons(coupons_request, expand=expand, placeholders=placeholders)
print(api_response)