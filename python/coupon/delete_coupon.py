from ultracart.apis import CouponApi
from samples import api_client

coupon_api = CouponApi(api_client())
coupon_oid = 123456789

coupon_api.delete_coupon(coupon_oid)