#!/usr/bin/env ruby

# Require necessary files
require 'ultracart_api'
require_relative '../constants'
require_relative 'customer_functions'

# getMagicLink returns back a url whereby a merchant can log into their website as the customer.
# This may be useful to "see what the customer is seeing" and is the only method to do so since
# the customer's passwords are encrypted. Note: A merchant may also do this using the UltraCart
# backend site within the Customer Management section.

begin
  # Initialize the customer API
  customer_api = UltracartClient::CustomerApi.new_using_api_key(Constants::API_KEY)

  # Create a customer
  customer_oid = insert_sample_customer
  storefront = "www.website.com"  # required. many merchants have dozens of storefronts. which one?

  # Get the magic link
  api_response = customer_api.get_magic_link(customer_oid, storefront)
  url = api_response.url

  # Output HTML to redirect to the magic link
  puts <<-HTML
<html>
<body>
<script>
window.location.href = #{url.to_json};
</script>
</body>
</html>
  HTML

  # Clean up this sample - don't do this or the above magic link won't work.
  # You'll want to clean up this sample customer manually using the backend.
  # delete_sample_customer(customer_oid)

rescue StandardError => e
  # Handle any exceptions that occur during the process
  puts 'An exception occurred. Please review the following error:'
  p e
  exit(1)
end

# Ensure a carriage return at the end of the file