#!/usr/bin/env ruby

require 'ultracart_api'
require_relative '../constants'

=begin
 This example illustrates how to retrieve customers. It uses the pagination logic necessary to query all customers
 using the getCustomersByQuery method.
=end

def get_customer_chunk(customer_api, offset, limit)
  # The real devil in the getCustomers calls is the expansion, making sure you return everything you need without
  # returning everything since these objects are extremely large. The customer object can be truly large with
  # all the order history. These are the possible expansion values:
  #
  # attachments     billing     cards           cc_emails       loyalty     orders_summary          pricing_tiers
  # privacy         properties  quotes_summary  reviewer        shipping    software_entitlements   tags
  # tax_codes

  # Just the address fields. Contact us if you're unsure
  expand = "shipping,billing"

  # TODO: This is just showing all the possibilities. In reality, you'll just assign the filters you need.
  query = UltracartClient::CustomerQuery.new
  # Uncomment and set as needed:
  # query.email = nil
  # query.qb_class = nil
  # query.quickbooks_code = nil
  # query.last_modified_dts_start = nil
  # query.last_modified_dts_end = nil
  # query.signup_dts_start = nil
  # query.signup_dts_end = nil
  # query.billing_first_name = nil
  # query.billing_last_name = nil
  # query.billing_company = nil
  # query.billing_city = nil
  # query.billing_state = nil
  # query.billing_postal_code = nil
  # query.billing_country_code = nil
  # query.billing_day_phone = nil
  # query.billing_evening_phone = nil
  # query.shipping_first_name = nil
  # query.shipping_last_name = nil
  # query.shipping_company = nil
  # query.shipping_city = nil
  # query.shipping_state = nil
  # query.shipping_postal_code = nil
  # query.shipping_country_code = nil
  # query.shipping_day_phone = nil
  # query.shipping_evening_phone = nil
  # query.pricing_tier_oid = nil
  # query.pricing_tier_name = nil

  since = nil
  sort = "email"

  # Call the API with query parameters
  api_response = customer_api.get_customers_by_query(
    query,
    offset,
    limit,
    since,
    sort,
    opts: {
      '_expand' => expand
    }
  )

  # Return customers or empty array
  api_response.customers || []
end

# Initialize the customer API
customer_api = UltracartClient::CustomerApi.new_using_api_key(Constants::API_KEY)

# Prepare for pagination
customers = []
iteration = 1
offset = 0
limit = 200
more_records_to_fetch = true

begin
  while more_records_to_fetch
    puts "executing iteration #{iteration}"

    # Fetch a chunk of customers
    chunk_of_customers = get_customer_chunk(customer_api, offset, limit)

    # Merge with existing customers
    customers.concat(chunk_of_customers)

    # Update offset and check if more records exist
    offset += limit
    more_records_to_fetch = chunk_of_customers.length == limit
    iteration += 1
  end
rescue UltracartClient::ApiError => e
  puts "ApiError occurred on iteration #{iteration}"
  p e
  exit 1
end

# This will be verbose...
p customers

# Add a final carriage return