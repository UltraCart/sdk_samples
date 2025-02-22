#!/usr/bin/env ruby

# Require the customer functions we created earlier
require_relative 'customer_functions'

begin
  # Insert a sample customer and get their OID
  customer_oid = insert_sample_customer

  # Delete the sample customer
  delete_sample_customer(customer_oid)

rescue StandardError => e
  # Handle any exceptions that occur during the process
  puts 'An exception occurred. Please review the following error:'
  p e
  exit(1)
end

# Ensure a carriage return at the end of the file