require 'ultracart_api'
require_relative '../constants'
require_relative './customer_functions'

begin
  # Insert a sample customer
  customer_oid = insert_sample_customer()

  # Initialize customer API
  customer_api = UltracartClient::CustomerApi.new_using_api_key(Constants::API_KEY)

  # Just want address fields. See https://www.ultracart.com/api/#resource_customer.html for all expansion values
  opts = {
    '_expand' => "billing,shipping"
  }

  # Retrieve customer with specified expansions
  customer = customer_api.get_customer(customer_oid, opts).customer

  # TODO: do some edits to the customer. Here we will change some billing fields.
  customer.billing[0].address2 = 'Apartment 101'

  # Notice expand is passed to update as well since it returns back an updated customer object.
  # We use the same expansion, so we get back the same fields and can do comparisons.
  api_response = customer_api.update_customer(customer_oid, customer, opts)

  # Verify the update
  p api_response.customer

  # Delete the sample customer
  delete_sample_customer(customer_oid)

rescue UltracartClient::ApiError => e
  puts 'An ApiException occurred. Please review the following error:'
  p e # <-- change_me: handle gracefully
  exit(1)
end