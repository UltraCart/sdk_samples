#!/usr/bin/env ruby

require 'ultracart_api'
require_relative '../constants'
require_relative './customer_functions'

# Of the two getCustomer methods, you'll probably always use getCustomerByEmail instead of this one.
# Most customer logic revolves around the email, not the customer oid. The latter is only meaningful as a primary
# key in the UltraCart databases. But here is an example of using getCustomer().

begin
  # Create a random email and insert a sample customer
  email = create_random_email
  customer_oid = insert_sample_customer(email)

  # Initialize the customer API
  customer_api = UltracartClient::CustomerApi.new_using_api_key(Constants::API_KEY)

  # The _expand variable is set to return just the address fields.
  # See customer_functions.rb for a list of expansions, or consult the source: https://www.ultracart.com/api/
  api_response = customer_api.get_customer(
    customer_oid,
    opts: {
      '_expand' => 'billing,shipping'
    }
  )

  # Assuming this succeeded
  customer = api_response.customer

  # Output the customer details
  p customer

  # Delete the sample customer
  delete_sample_customer(customer_oid)

rescue UltracartClient::ApiError => e
  puts 'An ApiError occurred. Please review the following error:'
  p e
  exit 1
end

# Add a final carriage return