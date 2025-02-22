#!/usr/bin/env ruby

require 'ultracart_api'
require_relative '../constants'

# This example was designed for our run_samples.sh script, so the output is not html, but human-readable text.
# In an effort to be repeatable, this script will delete the customer created.
# If you wish to inspect the created customer in the backend, just comment out delete call

# Creates a random email address
def create_random_email
  rand_str = ('A'..'H').to_a.shuffle.join
  "sample_#{rand_str}.test.com"
end

# Inserts a sample customer
#
# @param email [String, nil] Email address for the customer (optional)
# @return [Integer] The new created customer's customer_profile_oid
def insert_sample_customer(email = nil)
  # Generate a random string for various fields
  rand_str = ('A'..'H').to_a.shuffle.join

  # Use provided email or generate a new one
  email ||= create_random_email
  puts "insertSampleCustomer will attempt to create customer #{email}"

  # Initialize the customer API
  customer_api = UltracartClient::CustomerApi.new_using_api_key(Constants::API_KEY)

  # Create a new customer object
  new_customer = UltracartClient::Customer.new(
    email: email,
    billing: [
      UltracartClient::CustomerBilling.new(
        first_name: "First#{rand_str}",
        last_name: "Last#{rand_str}",
        company: "Company#{rand_str}",
        country_code: "US",
        state_region: "GA",
        city: "Duluth",
        postal_code: "30097",
        address1: "11960 Johns Creek Parkway"
      )
    ],
    shipping: [
      UltracartClient::CustomerShipping.new(
        first_name: "First#{rand_str}",
        last_name: "Last#{rand_str}",
        company: "Company#{rand_str}",
        country_code: "US",
        state_region: "GA",
        city: "Duluth",
        postal_code: "30097",
        address1: "11960 Johns Creek Parkway"
      )
    ]
  )

  # Define expansion variables
  # Possible Expansion variables:
  # attachments, billing, cards, cc_emails, loyalty, orders_summary,
  # pricing_tiers, privacy, properties, quotes_summary, reviewer,
  # shipping, software_entitlements, tags, tax_codes
  expand = 'billing,shipping'

  # Output the request object
  puts 'insertCustomer request object follows:'
  p new_customer

  # Insert the customer
  begin
    api_response = customer_api.insert_customer(new_customer, opts: { '_expand' => expand })

    # Output the response object
    puts 'insertCustomer response object follows:'
    p api_response

    # Return the customer profile OID
    api_response.customer.customer_profile_oid
  rescue StandardError => e
    puts "An error occurred: #{e.message}"
    raise
  end
end

# Deletes a sample customer by their OID
#
# @param customer_oid [Integer] Customer OID of the customer to be deleted
def delete_sample_customer(customer_oid)
  # Initialize the customer API
  customer_api = UltracartClient::CustomerApi.new_using_api_key(Constants::API_KEY)

  # Call delete customer method
  puts "calling deleteCustomer(#{customer_oid})"
  customer_api.delete_customer(customer_oid)
rescue StandardError => e
  puts "An error occurred: #{e.message}"
  raise
end

# Ensure a carriage return at the end of the file