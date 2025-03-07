require 'ultracart_api'
require_relative '../constants'

# This method generates a unique encrypted key for an Order.  This is useful if you wish to provide links for
# customer orders without allowing someone to easily cycle through orders.  By requiring order tokens, you
# control which orders are viewable with a public hyperlink.
#
# This method works in tandem with OrderApi.getOrderByToken()
order_api = UltracartClient::OrderApi.new_using_api_key(Constants::API_KEY)

order_id = 'DEMO-0009104436'
order_token_response = order_api.generate_order_token(order_id)
order_token = order_token_response.order_token

puts "Order Token is: #{order_token}"

# The token format will look something like this:
# DEMO:UJZOGiIRLqgE3a10yp5wmEozLPNsGrDHNPiHfxsi0iAEcxgo9H74J/l6SR3X8g==