require 'ultracart_api'
require_relative '../constants'

# OrderApi.resend_shipment_confirmation() will resend (email) a shipment confirmation to a customer.

order_api = UltracartClient::OrderApi.new_using_api_key(Constants::API_KEY)

order_id = 'DEMO-0009104436'

api_response = order_api.resend_shipment_confirmation(order_id)

if api_response.error
  puts api_response.error.developer_message
  puts api_response.error.user_message
  puts 'Order could not be adjusted. See output above.'
  exit
end

if api_response.success
  puts 'Shipment confirmation was resent.'
else
  puts 'Failed to resend shipment confirmation.'
end