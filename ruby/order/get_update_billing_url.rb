require 'ultracart_api'
require_relative '../constants'

# OrderApi.get_update_billing_url() generates the url a customer can use to update the billing information
# on the auto order associated with an order. This is the same url sent in the auto order update billing email.
# The order must belong to an auto order, otherwise a 400 error is returned. Either the original order
# or any rebill order of the auto order may be used.
# Requires the order_write permission, because the url carries a customer access token.

order_api = UltracartClient::OrderApi.new_using_api_key(Constants::API_KEY)

order_id = 'DEMO-0009104390'

begin
  api_response = order_api.get_update_billing_url(order_id)

  # Check for errors
  if api_response.error
    puts "Developer Message: #{api_response.error.developer_message}"
    puts "User Message: #{api_response.error.user_message}"
    exit
  end

  # WARNING: The update billing url is sensitive. It grants access to the customer's billing information.
  # Do not log it or expose it publicly in production. Deliver it only to the customer who owns the auto order.
  puts "Update billing url: #{api_response.update_billing_url}"
rescue StandardError => e
  puts "An error occurred: #{e.message}"
end
