#!/usr/bin/env ruby

require 'ultracart_api'
require_relative '../constants'

# Adjust process time limits (Ruby doesn't have direct equivalents to PHP's set_time_limit and ini_set)
# Note: These are more commonly handled by the runtime environment in Ruby

=begin
 This example illustrates how to retrieve customers. It uses the pagination logic necessary to query all customers.
 This method was the first getCustomers and has parameters for all the search terms. It's an ogre. Using
 getCustomersByQuery is much easier to use.
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

  # TODO: Seriously, use getCustomersByQuery -- it's so much better than this old method.
  # Prepare all the nil parameters
  search_params = {
    email: nil,
    qb_class: nil,
    quickbooks_code: nil,
    last_modified_dts_start: nil,
    last_modified_dts_end: nil,
    signup_dts_start: nil,
    signup_dts_end: nil,
    billing_first_name: nil,
    billing_last_name: nil,
    billing_company: nil,
    billing_city: nil,
    billing_state: nil,
    billing_postal_code: nil,
    billing_country_code: nil,
    billing_day_phone: nil,
    billing_evening_phone: nil,
    shipping_first_name: nil,
    shipping_last_name: nil,
    shipping_company: nil,
    shipping_city: nil,
    shipping_state: nil,
    shipping_postal_code: nil,
    shipping_country_code: nil,
    shipping_day_phone: nil,
    shipping_evening_phone: nil,
    pricing_tier_oid: nil,
    pricing_tier_name: nil
  }

  # Call the API with all parameters
  api_response = customer_api.get_customers(
    **search_params,
    limit: limit,
    offset: offset,
    since: nil,
    sort: nil,
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
