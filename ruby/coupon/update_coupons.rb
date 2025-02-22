require 'ultracart_api'
require_relative '../constants'

# Initialize the coupon API
coupon_api = UltracartClient::CouponApi.new_using_api_key(Constants::API_KEY)
coupon_oid = 123456789

# coupons do not have expansions or placeholders
api_response = coupon_api.get_coupon(coupon_oid, {_expand: nil})
coupon = api_response.coupon

# update the coupon.  this can be difficult given the complexity of coupons.  see insertCoupon sample for details.
coupon.expiration_dts = (Date.today + 90).strftime('%Y-%m-%d') + 'T00:00:00+00:00'

# This example only has one coupon.  But it's a trivial matter to add more coupons
coupons_request = UltracartClient::CouponsRequest.new
coupons_request.coupons = [coupon]

api_response = coupon_api.update_coupons(coupons_request, {_expand: nil, _placeholders: nil})
updated_coupons = api_response.coupons
puts updated_coupons