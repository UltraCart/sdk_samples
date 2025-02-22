require_relative '../constants'
require 'ultracart_api'

coupon_api = UltracartClient::CouponApi.new_using_api_key(Constants::API_KEY)
coupon_oid = 12345678  # if you don't know your coupon_oid, use generate_one_time_codes_by_merchant_code.  same results

codes_request = UltracartClient::CouponCodesRequest.new
codes_request.quantity = 100  # give me 100 codes.
codes_request.expiration_dts = (Date.today + 90).strftime('%Y-%m-%d') + 'T00:00:00+00:00'  # do you want the codes to expire?
# codes_request.expiration_seconds  # also an option for short-lived coupons

api_response = coupon_api.generate_coupon_codes(coupon_oid, codes_request)
coupon_codes = api_response.coupon_codes