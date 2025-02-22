require 'ultracart_api'
require_relative '../constants'

# OrderApi.getOrder() retrieves a single order for a given order_id.
order_api = UltracartClient::OrderApi.new_using_api_key(Constants::API_KEY)

# The expansion variable instructs UltraCart how much information to return.  The order object is large and
# while it's easily manageable for a single order, when querying thousands of orders, is useful to reduce
# payload size.
# see www.ultracart.com/api/ for all the expansion fields available (this list below may become stale)
=begin
Possible Order Expansions:
affiliate           affiliate.ledger                    auto_order
billing             channel_partner                     checkout
coupon              customer_profile                    digital_order
edi                 fraud_score                         gift
gift_certificate    internal                            item
linked_shipment     marketing                           payment
payment.transaction quote                               salesforce
shipping            shipping.tracking_number_details    summary
taxes
=end
expansion = "item,summary,billing,shipping,shipping.tracking_number_details"

order_id = 'DEMO-0009104390'
opts = {
  '_expand' => expansion
}

begin
  api_response = order_api.get_order(order_id, opts)

  # Check for errors
  if api_response.error
    puts "Developer Message: #{api_response.error.developer_message}"
    puts "User Message: #{api_response.error.user_message}"
    exit
  end

  order = api_response.order

  # Using inspect instead of var_dump for Ruby-style object representation
  puts order.inspect
rescue StandardError => e
  puts "An error occurred: #{e.message}"
end