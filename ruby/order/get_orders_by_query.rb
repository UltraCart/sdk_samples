# frozen_string_literal: true

require 'ultracart_api'
require_relative '../constants'
require 'date'

# Increase script execution time limit
Process.setrlimit(Process::RLIMIT_CPU, 3000)

=begin
 This example illustrates how to query the OrderQuery object to select a range of records.  It uses a subroutine
 to aggregate the records that span multiple API calls.  This example illustrates a work-around to selecting
 all rejected orders.  Because the UltraCart SDK does not have a way to query orders based on whether they
 were rejected, we can instead query based on the rejected_dts, which is null if the order is not rejected.
 So we will simply use a large time frame to ensure we query all rejections.
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

  # Uncomment the next two lines to retrieve a single order.  But there are simpler methods to do that.
  # order_id = "DEMO-0009104390"
  # order_query.order_id = order_id

  # Create query with a very large date range
  begin_dts = (Date.today - 2000).strftime('%Y-%m-%d') + "T00:00:00+00:00"
  end_dts = Date.today.strftime('%Y-%m-%d') + "T00:00:00+00:00"

  # Log date range (Ruby equivalent of PHP's error_log)
  warn begin_dts
  warn end_dts

  # Prepare query
  query = UltracartClient::OrderQuery.new(
    refund_date_begin: begin_dts,
    refund_date_end: end_dts
  )

  # Make API call
  api_response = order_api.get_orders_by_query(
    order_query: query,
    opts: {
      '_limit' => limit,
      '_offset' => offset,
      '_expand' => expansion
    }
  )

  # Return orders or empty array
  api_response.orders || []
end

# Initialize API
order_api = UltracartClient::OrderApi.new_using_api_key(Constants::API_KEY)

# Initialize variables for order retrieval
orders = []
iteration = 1
offset = 0
limit = 200
more_records_to_fetch = true

# Retrieve orders in chunks
while more_records_to_fetch
  puts "executing iteration #{iteration}"

  chunk_of_orders = get_order_chunk(order_api, offset, limit)
  orders.concat(chunk_of_orders)

  offset += limit
  more_records_to_fetch = chunk_of_orders.length == limit
  iteration += 1
end

# Output orders
p orders