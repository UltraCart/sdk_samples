require 'ultracart_api'
require_relative '../constants'

# This method takes a normal order id and creates an empty auto order from it.  While this might seem useless having
# an auto order with no items, the original_order is used for shipping, billing, and payment information.
# Once you have your empty auto order, add items to it and call updateAutoOrder.

auto_order_api = UltracartClient::AutoOrderApi.new_using_api_key(Constants::API_KEY)

# see https://www.ultracart.com/api/#resource_auto_order.html for list
expand = "items,items.future_schedules,original_order,rebill_orders"

original_order_id = "DEMO-123457"
api_response = auto_order_api.establish_auto_order_by_reference_order_id(original_order_id, { '_expand' => expand })

empty_auto_order = api_response.auto_order
auto_order_oid = empty_auto_order.auto_order_oid

items = []
item = UltracartClient::AutoOrderItem.new
item.original_item_id = "ITEM_ABC" # This item should be configured with auto order features.
item.original_quantity = 1
item.arbitrary_unit_cost = 59.99
# Valid Frequencies
# "Weekly", "Biweekly", "Every...", "Every 10 Days", "Every 4 Weeks", "Every 6 Weeks", "Every 8 Weeks", "Every 24 Days", "Every 28 Days", "Monthly",
# "Every 45 Days", "Every 2 Months", "Every 3 Months", "Every 4 Months", "Every 5 Months", "Every 6 Months", "Yearly"
item.frequency = "Monthly"
items << item
empty_auto_order.items = items

validate_original_order = 'No'
api_response = auto_order_api.update_auto_order(auto_order_oid, empty_auto_order,  { '_expand' => expand, validate_original_order: validate_original_order })
updated_auto_order = api_response.auto_order
puts updated_auto_order.inspect