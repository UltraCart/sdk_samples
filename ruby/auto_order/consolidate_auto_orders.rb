require 'ultracart_api'
require_relative '../constants'

# consolidateAutoOrders
# an auto order with no items, the original_order is used for shipping, billing, and payment information.
# Once you have your empty auto order, add items to it and call updateAutoOrder.

auto_order_api = UltracartClient::AutoOrderApi.new_using_api_key(Constants::API_KEY)

# see https://www.ultracart.com/api/#resource_auto_order.html for list
expand = "items,items.future_schedules,original_order,rebill_orders"

target_auto_order_oid = 123456789 # set getAutoOrdersByQuery for retrieving auto orders where you can get their auto_order_oid.
consolidate_request = UltracartClient::AutoOrderConsolidate.new
consolidate_request.source_auto_order_oids = [23456789, 3456789] # these are the autoorder_oids you wish to consolidate into the target.

api_response = auto_order_api.consolidate_auto_orders(target_auto_order_oid, consolidate_request, { '_expand' => expand })

consolidated_auto_order = api_response.auto_order

# TODO: make sure the consolidated order has all the items and history of all orders.
puts consolidated_auto_order.inspect