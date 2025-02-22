#!/usr/bin/env ruby

# Adjusts the cashback balance of a customer.  This method's name is adjustInternalCertificate, which
# is a poor choice of naming, but results from an underlying implementation of using an internal gift certificate
# to track cashback balance.  Sorry for the confusion.
#
# This method requires a customer profile oid.  This is a unique number used by UltraCart to identify a customer.
# If you do not know a customer's oid, call getCustomerByEmail() to retrieve the customer and their oid.
#
# Possible Errors:
# Missing adjustment amount -> "adjust_internal_certificate_request.adjustment_amount is required and was missing"

require 'ultracart_api'
require_relative '../constants'

# Initialize the customer API
customer_api = UltracartClient::CustomerApi.new_using_api_key(Constants::API_KEY)

# Set the email of the customer
email = "test@ultracart.com"

# Retrieve the customer by email
customer = customer_api.get_customer_by_email(email).customer
customer_oid = customer.customer_profile_oid

# Create adjust internal certificate request
adjust_request = UltracartClient::AdjustInternalCertificateRequest.new(
  description: "Adjusting customer cashback balance because they called and complained about product.",
  expiration_days: 365, # expires in 365 days
  vesting_days: 45, # customer has to wait 45 days to use it
  adjustment_amount: 59, # add 59 to their balance
  order_id: 'DEMO-12345', # or leave nil. this ties the adjustment to a particular order
  entry_dts: nil # use current time
)

# Adjust internal certificate
begin
  api_response = customer_api.adjust_internal_certificate(customer_oid, adjust_request)

  # Check for any errors in the response
  if api_response.error
    puts "Developer Message: #{api_response.error.developer_message}"
    puts "User Message: #{api_response.error.user_message}"
    exit(1)
  end

  # Output response details
  puts "Success: #{api_response.success}"
  puts "Adjustment Amount: #{api_response.adjustment_amount}"
  puts "Balance Amount: #{api_response.balance_amount}"

  # Inspect the full response
  p api_response
rescue StandardError => e
  puts "An error occurred: #{e.message}"
  exit(1)
end

# Ensure a carriage return at the end of the file