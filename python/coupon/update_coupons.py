from ultracart.apis import CouponApi
from ultracart.models import CouponsRequest
from samples import api_client
from datetime import datetime, timedelta

coupon_api = CouponApi(api_client())
coupon_oid = 123456789

expand = None  # coupons do not have expansions
placeholders = None  # coupons do not use placeholders

api_response = coupon_api.get_coupon(coupon_oid, expand=expand)
coupon = api_response.coupon

# update the coupon.  this can be difficult given the complexity of coupons.  see insertCoupon sample for details.
expiration_date = (datetime.now() + timedelta(days=90)).strftime('%Y-%m-%dT00:00:00+00:00')
coupon.expiration_dts = expiration_date

# This example only has one coupon.  But it's a trivial matter to add more coupons
coupons_request = CouponsRequest()
coupons_request.coupons = [coupon]

api_response = coupon_api.update_coupons(coupons_request, expand=expand, placeholders=placeholders)
updated_coupons = api_response.coupons

print(updated_coupons)