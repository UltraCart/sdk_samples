from ultracart.apis import CouponApi
from samples import api_client

coupon_api = CouponApi(api_client())
coupon_oid = 123456789

expand = None  # coupons do not have expansions
api_response = coupon_api.get_coupon(coupon_oid, expand=expand)

print(api_response)