#!/usr/bin/env ruby

# Require necessary files
require 'ultracart_api'
require_relative '../constants'
require_relative 'customer_functions'

# The merge function was requested by UltraCart merchants that sell software and manage activation keys.
# Frequently, customers would purchase their software using one email address, and then accidentally
# re-subscribe using a different email address (for example, they purchased subsequent years using
# PayPal which was tied to their spouse's email).
#
# Merge combines the customer profiles, merging order history and software entitlements.
# It may be used to combine any two customer profiles for any reason.
#
# Success returns back a status code 204 (No Content)

begin
  # First customer
  first_customer_oid = insert_sample_customer

  # Second customer with a different email
  second_email = create_random_email
  second_customer_oid = insert_sample_customer(second_email)

  # Create merge request
  merge_request = UltracartClient::CustomerMergeRequest.new(
    # Supply either the email or the customer oid. Only need one.
    email: second_email
    # Alternatively: customer_profile_oid: customer_oid
  )

  # Initialize the customer API
  customer_api = UltracartClient::CustomerApi.new_using_api_key(Constants::API_KEY)

  # Merge customers
  customer_api.merge_customer(first_customer_oid, merge_request)

  # Clean up this sample
  delete_sample_customer(first_customer_oid)
  # Notice: No need to delete the second sample. The merge call deletes it.

rescue StandardError => e
  # Handle any exceptions that occur during the process
  puts 'An exception occurred. Please review the following error:'
  p e
  exit(1)
end

# Ensure a carriage return at the end of the file