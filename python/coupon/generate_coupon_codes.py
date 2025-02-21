from ultracart.apis import CouponApi
from ultracart.models import CouponCodesRequest
from samples import api_client
from datetime import datetime, timedelta

coupon_api = CouponApi(api_client())
coupon_oid = 12345678  # if you don't know your coupon_oid, use generate_one_time_codes_by_merchant_code.  same results

codes_request = CouponCodesRequest()
codes_request.quantity = 100  # give me 100 codes.
expiration_date = (datetime.now() + timedelta(days=90)).strftime('%Y-%m-%dT00:00:00+00:00')
codes_request.expiration_dts = expiration_date  # do you want the codes to expire?
# codes_request.expiration_seconds = None  # also an option for short-lived coupons

api_response = coupon_api.generate_coupon_codes(coupon_oid, codes_request)
coupon_codes = api_response.coupon_codes