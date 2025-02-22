require 'ultracart_api'
require_relative '../constants'

order_api = UltracartClient::OrderApi.new_using_api_key(Constants::API_KEY)

expansion = "checkout" # see the get_order sample for expansion discussion

order_id = 'DEMO-0009104976'
order = order_api.get_order(order_id, opts = { _expand: expansion }).order

p order

# TODO: do some updates to the order.

api_response = order_api.update_order(order_id, order, opts = { _expand: expansion })

if api_response.error
  puts api_response.error.developer_message
  puts api_response.error.user_message
  exit
end

updated_order = api_response.order

puts 'After Update'
p updated_order