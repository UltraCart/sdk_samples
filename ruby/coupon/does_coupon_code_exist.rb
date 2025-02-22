require_relative '../constants'
require 'ultracart_api'

coupon_api = UltracartClient::CouponApi.new_using_api_key(Constants::API_KEY)
merchant_code = '10OFF'

api_response = coupon_api.does_coupon_code_exist(merchant_code)
coupon_exists = api_response.exists

puts api_response.inspect