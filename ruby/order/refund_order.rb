require 'ultracart_api'
require_relative '../constants'

# refund_order() allows for both partial and complete refunds. Both are accomplished with the same steps.
# 1) retrieve an order object using the SDK.
# 2) input the refunded quantities for any or all items
# 3) call refund_order, passing in the modified object.
# 4) To do a full refund, set all item refund quantities to their purchased quantities.
#
# This example will perform a full refund.

order_api = UltracartClient::OrderApi.new_using_api_key(Constants::API_KEY)

# for the refund, I only need the items expanded to adjust their quantities.
# See: https://www.ultracart.com/api/  for a list of all expansions.
expansion = "items"

# Step 1. Retrieve the order
order_id = 'DEMO-0009104436'
order = order_api.get_order(order_id, opts = { _expand: expansion }).order

order.items.each do |item|
  item.quantity_refunded = item.quantity
end

reject_after_refund = false
skip_customer_notification = true
cancel_associated_auto_orders = true # does not matter for this sample. the order is not a recurring order.
consider_manual_refund_done_externally = false # no, I want an actual refund done through my gateway
reverse_affiliate_transactions = true # can't let my affiliates get money on a refunded order. bad business.

opts = {
  _expand: expansion,
  'skip_customer_notification': skip_customer_notification,
  'cancel_associated_auto_orders': cancel_associated_auto_orders,
  'consider_manual_refund_done_externally': consider_manual_refund_done_externally,
  'reverse_affiliate_transactions': reverse_affiliate_transactions
}

api_response = order_api.refund_order(order_id, order, opts)

refunded_order = api_response.order

# examined the subtotals and ensure everything was refunded correctly.
p refunded_order