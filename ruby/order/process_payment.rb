require 'ultracart_api'
require_relative '../constants'
require_relative '../item_functions'

# OrderApi.process_payment() was designed to charge a customer for an order. It was created to work in tandem with
# duplicate_order(), which does not accomplish payment on its own. The use-case for this method is to
# duplicate a customer's order and then charge them for it. duplicate_order() does not charge the customer again,
# which is why process_payment() exists.
#
# These are the steps for cloning an existing order and charging the customer for it.
# 1. duplicate_order
# 2. update_order (if you wish to change any part of it)
# 3. process_payment to charge the customer.
#
# As a reminder, if you wish to create a new order from scratch, use the CheckoutApi or ChannelPartnerApi.
# The OrderApi is for managing existing orders.

order_api = UltracartClient::OrderApi.new_using_api_key(Constants::API_KEY)

expansion = "items"   # for this example, we're going to change the items after we duplicate the order, so
# the only expansion properties we need are the items.
# See: https://www.ultracart.com/api/  for a list of all expansions.

# Step 1. Duplicate the order
order_id_to_duplicate = 'DEMO-0009104436'
api_response = order_api.duplicate_order(order_id_to_duplicate, opts = { _expand: expansion })
new_order = api_response.order

# Step 2. Update the items. I will create a new items array and assign it to the order to remove the old ones completely.
items = []
item = UltracartClient::OrderItem.new
item.merchant_item_id = 'simple_teapot'
item.quantity = 1
item.description = "A lovely teapot"
item.distribution_center_code = 'DFLT' # where is this item shipping out of?

cost = UltracartClient::Currency.new
cost.currency_code = 'USD'
cost.value = 9.99
item.cost = cost

weight = UltracartClient::Weight.new
weight.uom = "OZ"
weight.value = 6
item.weight = weight

items << item
new_order.items = items
update_response = order_api.update_order(new_order.order_id, new_order, opts = { _expand: expansion })

updated_order = update_response.order

# Step 3. process the payment.
# the request object below takes two optional arguments.
# The first is an amount if you wish to bill for an amount different from the order.
# We do not bill differently in this example.
# The second is card_verification_number_token, which is a token you can create by using our hosted fields to
# upload a CVV value. This will create a token you may use here. However, most merchants using the duplicate
# order method will be setting up an auto order for a customer. Those will not make use of the CVV, so we're
# not including it here. That is why the request object below is does not have any values set.
# For more info on hosted fields:
# See: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377775/UltraCart+Hosted+Credit+Card+Fields
# See: https://github.com/UltraCart/sdk_samples/blob/master/hosted_fields/hosted_fields.html

process_payment_request = UltracartClient::OrderProcessPaymentRequest.new
payment_response = order_api.process_payment(new_order.order_id, process_payment_request)
transaction_details = payment_response.payment_transaction # do whatever you wish with this.

puts 'New Order (after updated items):'
p updated_order
puts 'Payment Response:'
p payment_response