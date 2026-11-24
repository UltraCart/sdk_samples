require 'ultracart_api'
require_relative '../constants'

# OrderApi.cancel_order_with_options() cancels an order, the same as cancel_order(), with the options in a request body.
# An empty OrderCancelRequest behaves exactly like cancel_order().
#
# Options:
# - reject_reason:          stored on the order when it is rejected without a refund (Accounts Receivable, Pre-order,
#                           Quote or Hold), the same as the reject reason in the backend.  Reasons are configured at
#                           Home -> Configuration -> Order Management -> Refund/Reject Reasons
# - lock_self_ship_orders:  prevent the order from shipping during the refund process
# - skip_refund_and_hold:   skip the refund and move the order to the Held Orders department
#
# Rejecting an order in Accounts Receivable:
# - The customer is not emailed.
# - A rejected auto order rebill leaves the auto order active, so it rebills on its next cycle.
# - Rejecting the auto order's original order cancels the auto order, because the first payment never succeeded.
#
# Restrictions (the same as cancel_order()):
# 1) Cannot cancel completed orders
# 2) Cannot cancel already rejected orders
# 3) Cannot cancel orders transmitted to fulfillment center
# 4) Cannot cancel orders queued for distribution center transmission
#
# Requires SDK 4.1.260 or later.

order_api = UltracartClient::OrderApi.new_using_api_key(Constants::API_KEY)

order_id = 'DEMO-0009104436'

begin
  cancel_request = UltracartClient::OrderCancelRequest.new(reject_reason: 'Card declined')

  api_response = order_api.cancel_order_with_options(order_id, cancel_request)

  if api_response.error
    puts "Developer Message: #{api_response.error.developer_message}"
    puts "User Message: #{api_response.error.user_message}"
    puts 'Order could not be canceled.'
    exit
  end

  puts 'Order was canceled successfully.' if api_response.success
rescue UltracartClient::ApiError => e
  puts "Order could not be canceled due to an API error: #{e.response_body}"
end
