require_relative '../constants'
require 'ultracart_api'

coupon_api = UltracartClient::CouponApi.new_using_api_key(Constants::API_KEY)
api_response = coupon_api.get_coupon_by_merchant_code('10OFF')

puts api_response.inspect