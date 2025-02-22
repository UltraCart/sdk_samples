require_relative '../constants'
require 'ultracart_api'

# This method is useful if you have the coupons stored in your own system along with their coupon_oids.  If not,
# just use delete_coupons_by_code()

coupon_api = UltracartClient::CouponApi.new_using_api_key(Constants::API_KEY)
delete_request = UltracartClient::CouponDeletesRequest.new
delete_request.coupon_oids = [1234567, 2345678, 3456789]

coupon_api.delete_coupons_by_oid(delete_request)