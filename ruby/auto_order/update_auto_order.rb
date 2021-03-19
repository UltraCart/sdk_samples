# frozen_string_literal: true

# Rules for updating auto orders (recurring orders)
# To change the item that is delivered, change the AutoOrder.items[x].arbitrary_item_id
# To change the schedule (frequency) of when an item is delivered, change the original item.  It controls schedule
# To change the original item:  AutoOrder.items[x].original_item_id
#
# Alternate method:  Replace the item altogether.  Delete the current one and replace it with another item
# Note: The replacement item must be an auto order item.  (Edit item in backend, click on Auto Order tab)
# This is more complex as you must supply all the required fields.

require 'json'
require 'ultracart_api'

simple_key = '109ee846ee69f50177018ab12f008a00748a25aa28dbdc0177018ab12f008a00'
# ao is short for 'auto order', and is used heavily below.
ao_api = UltracartClient::AutoOrderApi.new_using_api_key(simple_key, false, false)
email = 'test@test.com'


query = UltracartClient::AutoOrderQuery.new
query.email = email
expansion = 'items,items.future_schedules,items.simple_schedule,rebill_orders'
ao_response = ao_api.get_auto_orders_by_query(query, { _expand: expansion })

# there should only be one auto order for a customer.  that's typical.
# If you are marketing more than one, than you must loop through the result set
# and find the auto order you're looking for manually

auto_order = ao_response.auto_orders[0]

existing_item = 'OldItemID'
upgrade_item = 'NewItemID'

auto_order.items.each do |auto_order_item|
  auto_order_item.arbitrary_item_id = upgrade_item if auto_order_item.original_item_id = existing_item
end

# save the auto order with the updated item.
ao_api.update_auto_order(auto_order, auto_order.auto_order_oid, { _expand: expansion })




