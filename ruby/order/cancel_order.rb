# OrderApi.cancel_order() will do just that.  It will cancel an order by rejecting it.
# However, the following restrictions apply:
# 1) If the order is already completed, this call will fail.
# 2) If the order has already been rejected, this call will fail.
# 3) If the order has already been transmitted to a fulfillment center, this call will fail.
# 4) If the order is queued for transmission to a distribution center, this call will fail.

require_relative '../constants'
require 'ultracart_api'

order_api = UltracartClient::OrderApi.new_using_api_key(Constants::API_KEY)

order_id = 'DEMO-0009104390'
api_response = order_api.cancel_order(order_id)

if api_response.get_error != nil
  # Log the error messages
  puts "Developer Message: #{api_response.get_error.get_developer_message}"
  puts "User Message: #{api_response.get_error.get_user_message}"
  puts 'Order could not be canceled. See ruby error log.'
  exit
end

if api_response.get_success
  puts 'Order was canceled successfully.'
end