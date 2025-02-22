# frozen_string_literal: true

require 'ultracart_api'
require_relative '../constants'

# Increase script execution time limit
Process.setrlimit(Process::RLIMIT_CPU, 3000)

=begin
 getOrders was the first order query provided by UltraCart.  It still functions well, but it is extremely verbose
 because the query call takes a variable for every possible filter.  You are advised to get getOrdersByQuery().
 It is easier to use and will result in less code.  Still, we provide an example here to be thorough.

 For this script, we will query all orders for a particular email address.  The getOrdersByQuery() example
 illustrates using a date range to filter and select orders.
=end

def get_order_chunk(order_api, offset, limit)
  # Possible Order Expansions:
  # affiliate           affiliate.ledger                    auto_order
  # billing             channel_partner                     checkout
  # coupon              customer_profile                    digital_order
  # edi                 fraud_score                         gift
  # gift_certificate    internal                            item
  # linked_shipment     marketing                           payment
  # payment.transaction quote                               salesforce
  # shipping            shipping.tracking_number_details    summary
  # taxes

  expansion = "item,summary,billing,shipping,shipping.tracking_number_details"

  # Prepare opts hash with all parameters
  opts = {
    'order_id' => nil,
    'payment_method' => nil,
    'company' => nil,
    'first_name' => nil,
    'last_name' => nil,
    'city' => nil,
    'state_region' => nil,
    'postal_code' => nil,
    'country_code' => nil,
    'phone' => nil,
    'email' => 'support@ultracart.com', # Only filter we're using
    'cc_email' => nil,
    'total' => nil,
    'screen_branding_theme_code' => nil,
    'storefront_host_name' => nil,
    'creation_date_begin' => nil,
    'creation_date_end' => nil,
    'payment_date_begin' => nil,
    'payment_date_end' => nil,
    'shipment_date_begin' => nil,
    'shipment_date_end' => nil,
    'rma' => nil,
    'purchase_order_number' => nil,
    'item_id' => nil,
    'current_stage' => nil,
    'channel_partner_code' => nil,
    'channel_partner_order_id' => nil,
    '_sort' => nil,
    '_limit' => limit,
    '_offset' => offset,
    '_expand' => expansion
  }

  # Make API call
  api_response = order_api.get_orders(opts)

  # Return orders or empty array
  api_response.orders || []
end

# Initialize variables for order retrieval
orders = []
iteration = 1
offset = 0
limit = 200
more_records_to_fetch = true

# Retrieve orders in chunks
order_api = UltracartClient::OrderApi.new_using_api_key(Constants::API_KEY)

while more_records_to_fetch
  puts "executing iteration #{iteration}"

  chunk_of_orders = get_order_chunk(order_api, offset, limit)
  orders.concat(chunk_of_orders)

  offset += limit
  more_records_to_fetch = chunk_of_orders.length == limit
  iteration += 1
end

# Output orders (without HTML wrapping as per guidelines)
p orders