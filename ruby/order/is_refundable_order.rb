require 'ultracart_api'
require_relative '../constants'

# isRefundable queries the UltraCart system whether an order is refundable or not.
# In addition to a simple boolean response, UltraCart also returns back any reasons why
# an order is not refundable.
# Finally, the response also contains any refund or return reasons configured on the account in the event
# that this merchant account is configured to require a reason for a return or refund.

order_api = UltracartClient::OrderApi.new_using_api_key(Constants::API_KEY)

order_id = 'DEMO-0009104976'
api_response = order_api.is_refundable_order(order_id)

p api_response