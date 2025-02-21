from ultracart.apis import CouponApi
from ultracart.models import CouponDeletesRequest
from samples import api_client

# This method is useful if you have the coupons stored in your own system along with their coupon_oids.  If not,
# just use delete_coupons_by_code()

coupon_api = CouponApi(api_client())
delete_request = CouponDeletesRequest()
delete_request.coupon_oids = [1234567, 2345678, 3456789]

coupon_api.delete_coupons_by_oid(delete_request)