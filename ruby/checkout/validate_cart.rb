require 'ultracart_api'
require_relative '../constants'

# Reference Implementation: https://github.com/UltraCart/responsive_checkout

checkout_api = UltracartClient::CheckoutApi.new_using_api_key(Constants::API_KEY)

cart_id = '123456789123456789123456789123456789' # Usually this would be retrieved from a session variable or cookie.

expansion = 'items,billing,shipping,coupons,checkout,payment,summary,taxes'

cart = checkout_api.get_cart_by_cart_id(cart_id, {_expand: expansion}).cart

validation_request = UltracartClient::CartValidationRequest.new
validation_request.cart = cart

# Possible Checks (you can set these as needed, or leave as default):
# validation_request.set_checks(["All", "Item Quantity Valid", "Payment Information Validate"])

api_response = checkout_api.validate_cart(validation_request, {_expand: expansion})
cart = api_response.cart

puts "Validation Errors:"
puts api_response.errors.inspect
