require 'ultracart_api'
require_relative '../constants'

# getOrderCustomerActivity returns the customer activity associated with the email address on an order.
# This includes email engagement history, email list and segment membership, lifetime metrics and email
# suppression status.
#
# A customer profile is NOT required and is not consulted.  The activity is keyed off the email address on
# the order, so this works for guest orders that have never had a customer profile established.  For the
# page views captured during the session that placed the order, use get_order_page_view_history instead.
#
# If the order has no valid email address, email and customer_activity both come back nil.  That is a
# successful response rather than an error - without an email there is no activity record to find.
#
# Note: activity.ts is a unix timestamp in milliseconds, not an ISO 8601 string like most dates in this API.
#
# Possible Errors:
# order_id does not start with the merchant id -> "Path parameter 'order_id' does not start with the merchant id.  Check your parameter value and call log."
order_api = UltracartClient::OrderApi.new_using_api_key(Constants::API_KEY)

order_id = 'DEMO-0009104976'

begin
  api_response = order_api.get_order_customer_activity(order_id)
  customer_activity = api_response.customer_activity

  puts "Customer activity for: #{api_response.email}"

  if customer_activity.nil?
    puts 'No customer activity found for this order.'
  else
    puts "Globally unsubscribed: #{customer_activity.global_unsubscribed}"
    puts "Spam complaint: #{customer_activity.spam_complaint}"

    # Using inspect instead of var_dump for Ruby-style object representation
    puts customer_activity.activities.inspect
  end
rescue StandardError => e
  puts "An error occurred: #{e.message}"
end
