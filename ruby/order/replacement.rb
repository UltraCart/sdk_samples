require 'ultracart_api'
require_relative '../constants'

# The use-case for replacement() is to create another order for a customer to replace the items of the existing
# order. For example, a merchant is selling perishable goods and the goods arrive late, spoiled. replacement()
# helps to create another order to send more goods to the customer.
#
# You MUST supply the items you desire in the replacement order. This is done with the OrderReplacement.items field.
# All options are displayed below including whether to charge the customer for this replacement order or not.

order_api = UltracartClient::OrderApi.new_using_api_key(Constants::API_KEY)

# Step 1. Replace the order
order_id_to_replace = 'DEMO-0009104436'
replacement_options = UltracartClient::OrderReplacement.new
replacement_options.original_order_id = order_id_to_replace

items = []

item1 = UltracartClient::OrderReplacementItem.new
item1.merchant_item_id = 'TSHIRT'
item1.quantity = 1
# item1.arbitrary_unit_cost = 9.99
items << item1

item2 = UltracartClient::OrderReplacementItem.new
item2.merchant_item_id = 'BONE'
item2.quantity = 2
items << item2

replacement_options.items = items

# replacement_options.shipping_method = 'FedEx: Ground'
replacement_options.immediate_charge = true
replacement_options.skip_payment = true
replacement_options.free = true
replacement_options.custom_field1 = 'Whatever'
replacement_options.custom_field4 = 'More Whatever'
replacement_options.additional_merchant_notes_new_order = 'Replacement order for spoiled ice cream'
replacement_options.additional_merchant_notes_original_order = 'This order was replaced.'

api_response = order_api.replacement(order_id_to_replace, replacement_options)

puts "Replacement Order: #{api_response.order_id}"
puts "Success flag: #{api_response.successful}"