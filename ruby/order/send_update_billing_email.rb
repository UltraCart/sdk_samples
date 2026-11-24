require 'ultracart_api'
require_relative '../constants'

# OrderApi.send_update_billing_email() emails the customer a link to update their billing information on an order
# that is in Accounts Receivable.  It is the API version of the "Send Billing Update" button on the
# Accounts Receivable Process Payment screen.  The email goes out within a minute.
#
# While the order is less than 7 days old, UltraCart sends a reminder every 2 days after this email.
#
# The call is refused (HTTP 400, raised as an UltracartClient::ApiError) when:
# - the order is not in Accounts Receivable
# - the order does not have a valid email address
# - the update billing email is turned off for the account
# - a StoreFront communication flow handles unprocessed payments for the order (the flow emails the customer instead)
# - this method already sent the email for the order in the last 24 hours
#
# Requires SDK 4.1.260 or later.

order_api = UltracartClient::OrderApi.new_using_api_key(Constants::API_KEY)

order_id = 'DEMO-0009104436'

begin
  api_response = order_api.send_update_billing_email(order_id)

  if api_response.error
    puts "Developer Message: #{api_response.error.developer_message}"
    puts "User Message: #{api_response.error.user_message}"
    exit
  end

  puts 'Update billing email was queued.' if api_response.success
rescue UltracartClient::ApiError => e
  # The reason for a refusal is in the response body.
  puts "Exception when calling OrderApi->send_update_billing_email: #{e.response_body}"
end
