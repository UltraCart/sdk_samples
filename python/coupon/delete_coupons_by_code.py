from ultracart.apis import CouponApi
from ultracart.models import CouponDeletesRequest
from samples import api_client

coupon_api = CouponApi(api_client())
merchant_code = '10OFF'
delete_request = CouponDeletesRequest()
delete_request.coupon_codes = [merchant_code]

coupon_api.delete_coupons_by_code(delete_request)