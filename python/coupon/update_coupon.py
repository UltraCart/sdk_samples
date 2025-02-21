from ultracart.apis import CouponApi
from samples import api_client
from datetime import datetime, timedelta

coupon_api = CouponApi(api_client())
coupon_oid = 123456789

expand = None  # coupons do not have expansions
api_response = coupon_api.get_coupon(coupon_oid, expand=expand)
coupon = api_response.coupon

# update the coupon.  this can be difficult given the complexity of coupons.  see insertCoupon sample for details.
expiration_date = (datetime.now() + timedelta(days=90)).strftime('%Y-%m-%dT00:00:00+00:00')
coupon.expiration_dts = expiration_date

api_response = coupon_api.update_coupon(coupon_oid, coupon, expand=expand)
updated_coupon = api_response.coupon

print(updated_coupon)