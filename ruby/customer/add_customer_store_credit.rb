#!/usr/bin/env ruby

# Adds store credit to a customer's account.
#
# This method requires a customer profile oid.  This is a unique number used by UltraCart to identify a customer.
# If you do not know a customer's oid, call getCustomerByEmail() to retrieve the customer and their oid.
#
# Possible Errors:
# Missing store credit -> "store_credit_request.amount is missing and is required."
# Zero or negative store credit -> "store_credit_request.amount must be a positive amount."

require 'ultracart_api'
require_relative '../constants'

# Initialize the customer API
customer_api = UltracartClient::CustomerApi.new_using_api_key(Constants::API_KEY)

# Set the email of the customer
email = "test@ultracart.com"

# Retrieve the customer by email
customer = customer_api.get_customer_by_email(email).customer
customer_oid = customer.customer_profile_oid

# Create store credit add request
store_credit_request = UltracartClient::CustomerStoreCreditAddRequest.new(
  amount: 20.00,
  description: "Customer is super cool and I wanted to give them store credit.",
  expiration_days: 365, # or leave nil for no expiration
  vesting_days: 45 # customer has to wait 45 days to use it
)

# Add store credit to the customer's account
begin
  api_response = customer_api.add_customer_store_credit(customer_oid, store_credit_request)

  # Check for any errors in the response
  if api_response.error
    puts "Developer Message: #{api_response.error.developer_message}"
    puts "User Message: #{api_response.error.user_message}"
    exit(1)
  end

  # Output the success response
  p api_response.success
rescue StandardError => e
  puts "An error occurred: #{e.message}"
  exit(1)
end