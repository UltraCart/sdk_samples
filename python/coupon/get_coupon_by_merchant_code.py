from ultracart.apis import CouponApi
from samples import api_client

coupon_api = CouponApi(api_client())
api_response = coupon_api.get_coupon_by_merchant_code('10OFF')

print(api_response)