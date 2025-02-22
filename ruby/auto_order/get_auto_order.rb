require 'ultracart_api'
require_relative '../constants'

# retrieves an auto_order given the auto_order_oid;

auto_order_api = UltracartClient::AutoOrderApi.new_using_api_key(Constants::API_KEY)

# see https://www.ultracart.com/api/#resource_auto_order.html for list
expand = "items,items.future_schedules,original_order,rebill_orders"
auto_order_oid = 123456789 # If you don't know the oid, use getAutoOrdersByQuery for retrieving auto orders
api_response = auto_order_api.get_auto_order(auto_order_oid, { '_expand' => expand })
auto_order = api_response.auto_order
puts auto_order.inspect