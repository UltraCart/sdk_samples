require 'ultracart_api'
require_relative '../constants'

#
# blockRefundOnOrder sets an order property that is considered when a refund request is made.
# If the property is present, the refund is denied.  Being an order property allows for querying
# upon it within BigQuery for audit purposes.
#
order_api = UltracartClient::OrderApi.new_using_api_key(Constants::API_KEY)

order_id = 'DEMO-0009105222'
order_api.block_refund_on_order(order_id, {block_reason: 'Chargeback'})

p 'Method executed successfully.  Returns back 204 No Content'
