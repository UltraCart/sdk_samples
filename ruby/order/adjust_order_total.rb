# OrderApi.adjust_order_total() takes a desired order total and performs goal-seeking to adjust all items and taxes
# appropriately.  This method was created for merchants dealing with Medicare and Medicaid.  When selling their
# medical devices, they would often run into limits approved by Medicare.  As such, they needed to adjust the
# order total to match the approved amount.  This is a convenience method to adjust individual items and their
# taxes to match the desired total.

require_relative '../constants'
require 'ultracart_api'

order_api = UltracartClient::OrderApi.new_using_api_key(Constants::API_KEY)

order_id = 'DEMO-0009104390'
desired_total = '21.99'
api_response = order_api.adjust_order_total(order_id, desired_total)

if api_response.get_error != nil
  # Log the error messages
  puts "Developer Message: #{api_response.get_error.get_developer_message}"
  puts "User Message: #{api_response.get_error.get_user_message}"
  puts 'Order could not be adjusted. See ruby error log.'
  exit
end

if api_response.get_success
  puts 'Order was adjusted successfully. Use get_order() to retrieve the order if needed.'
end