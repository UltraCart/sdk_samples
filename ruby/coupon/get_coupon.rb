require_relative '../constants'
require 'ultracart_api'

coupon_api = UltracartClient::CouponApi.new_using_api_key(Constants::API_KEY)
coupon_oid = 123456789

# coupons do not have expansions
api_response = coupon_api.get_coupon(coupon_oid, { _expand: nil })

puts api_response.inspect