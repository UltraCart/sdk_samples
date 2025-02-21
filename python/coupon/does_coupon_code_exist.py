from ultracart.apis import CouponApi
from samples import api_client

coupon_api = CouponApi(api_client())
merchant_code = '10OFF'

api_response = coupon_api.does_coupon_code_exist(merchant_code)
coupon_exists = api_response.exists

print(api_response)