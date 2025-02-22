require_relative '../constants'
require 'ultracart_api'

=begin
    getAutoApply returns back the items and subtotals that trigger "auto coupons", i.e. coupons that are automatically
    added to a shopping cart.  The manual configuration of auto coupons is at the bottom of the main coupons screen.
    See: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1376525/Coupons#Coupons-Navigation
=end

coupon_api = UltracartClient::CouponApi.new_using_api_key(Constants::API_KEY)
api_response = coupon_api.get_auto_apply

puts 'These are the subtotal levels:'
api_response.subtotal_levels.each do |subtotal_level|
  puts subtotal_level.inspect
end

puts "\nThese are the item triggers:"
api_response.required_items.each do |required_item|
  puts required_item.inspect
end