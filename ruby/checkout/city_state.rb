# Reference Implementation: https://github.com/UltraCart/responsive_checkout
# Takes a postal code and returns back a city and state (US Only)

require 'ultracart_api'
require_relative '../constants'

checkout_api = UltracartClient::CheckoutApi.new_using_api_key(Constants::API_KEY)

cart_id = '123456789123456789123456789123456789'  # you should have the cart id from session or cookie
cart = UltracartClient::Cart.new
cart.cart_id = cart_id  # required
cart.shipping = UltracartClient::CartShipping.new
cart.shipping.postal_code = '44233'

api_response = checkout_api.city_state(cart)
puts "City: #{api_response.city}"
puts "State: #{api_response.state}"