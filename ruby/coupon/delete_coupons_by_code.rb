require_relative '../constants'
require 'ultracart_api'

coupon_api = UltracartClient::CouponApi.new_using_api_key(Constants::API_KEY)
merchant_code = '10OFF'
delete_request = UltracartClient::CouponDeletesRequest.new
delete_request.coupon_codes = [merchant_code]

coupon_api.delete_coupons_by_code(delete_request)