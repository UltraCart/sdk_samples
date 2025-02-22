require_relative '../constants'
require 'ultracart_api'

coupon_api = UltracartClient::CouponApi.new_using_api_key(Constants::API_KEY)
coupon_oid = 123456789

coupon_api.delete_coupon(coupon_oid)