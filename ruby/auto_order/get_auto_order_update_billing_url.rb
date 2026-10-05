require 'ultracart_api'
require_relative '../constants'

# AutoOrderApi.get_auto_order_update_billing_url() generates the url a customer can use to update the
# billing information on an auto order. This is the same url sent in the auto order update billing email.
# Requires the auto_order_write permission, because the url carries a customer access token.

auto_order_api = UltracartClient::AutoOrderApi.new_using_api_key(Constants::API_KEY)

auto_order_oid = 123456789 # If you don't know the oid, use getAutoOrdersByQuery for retrieving auto orders

begin
  api_response = auto_order_api.get_auto_order_update_billing_url(auto_order_oid)

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
