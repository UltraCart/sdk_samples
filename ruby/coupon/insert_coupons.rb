require 'ultracart_api'
require_relative '../constants'

# Similar to insertCoupon except this method takes a request object containing up to 50 coupons.  Please see
# insertCoupon for a detailed example on creating a coupon.  It is not repeated here.

# Initialize the coupon API
coupon_api = UltracartClient::CouponApi.new_using_api_key(Constants::API_KEY)

coupons_request = UltracartClient::CouponsRequest.new
coupons = []
# TODO: add Coupons() to this array (see insertCoupon sample for help)
coupons_request.coupons = coupons

# coupons do not have expansions or placeholders
api_response = coupon_api.insert_coupons(coupons_request, {_expand: nil, _placeholders: nil})
puts api_response