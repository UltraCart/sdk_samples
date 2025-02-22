# frozen_string_literal: true

require 'ultracart_api'
require_relative '../constants'

=begin
 This method is useful when you need to query a defined set of orders and would like to avoid querying them
 one at a time.
=end

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

# Initialize API
order_api = UltracartClient::OrderApi.new_using_api_key(Constants::API_KEY)

# Define expansion
expansion = "item,summary,billing,shipping,shipping.tracking_number_details"

# Prepare order batch
order_batch = UltracartClient::OrderQueryBatch.new(
  order_ids: ['DEMO-0009104390', 'DEMO-0009104391', 'DEMO-0009104392']
)

# Retrieve orders
begin
  api_response = order_api.get_orders_batch(
    order_query_batch: order_batch,
    opts: { '_expand' => expansion }
  )

  # Check for errors
  if api_response.error
    warn "Developer Message: #{api_response.error.developer_message}"
    warn "User Message: #{api_response.error.user_message}"
    exit 1
  end

  # Get orders
  orders = api_response.orders

  if orders.empty?
    warn "There were no orders returned by this query."
    exit
  end

  # Process each order
  orders.each do |order|
    # Access summary
    summary = order.summary
    actual_shipping_cost = summary.actual_shipping&.localized || 0

    # Access shipping information
    s_addr = order.shipping
    tracking_numbers = s_addr.tracking_numbers || []
    tracking_numbers.each do |tnum|
      # Do something with tracking number here
    end

    # Extract shipping address details
    sfname = s_addr.first_name
    slname = s_addr.last_name
    saddress1 = s_addr.address1
    saddress2 = s_addr.address2
    scity = s_addr.city
    sregion = s_addr.state_region
    sccode = s_addr.country_code
    spcode = s_addr.postal_code
    sdayphone = s_addr.day_phone
    shipping_method = s_addr.shipping_method

    # Access billing information
    b_addr = order.billing
    b_addr.address1
    b_addr.address2
    b_addr.city
    b_addr.state_region
    b_addr.country_code
    b_addr.postal_code
    bemail = b_addr.email # email is located on the billing object

    # Process order items
    items = order.items || []
    items.each do |item|
      qty = item.quantity
      item_id = item.merchant_item_id
      description = item.description
      cost = item.cost
      cost.localized # cost as float
      real_cost = cost.localized_formatted # cost with symbols
    end
  end

  # Output orders
  p orders

rescue StandardError => e
  warn "An error occurred: #{e.message}"
  warn e.backtrace.join("\n")
end