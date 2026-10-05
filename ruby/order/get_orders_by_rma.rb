require 'ultracart_api'
require_relative '../constants'

# OrderApi.get_orders_by_rma() retrieves the orders associated with an RMA number.
# The RMA must be an exact match; wildcards such as * are not permitted and will return a 400 error.
# Multiple orders can share the same RMA, so this call returns a list of orders.
# This lookup is backed by a search index, so an RMA that was just assigned may take a short time to appear.
# Requires the order_read permission.

order_api = UltracartClient::OrderApi.new_using_api_key(Constants::API_KEY)

rma = 'RMA-12345'

# see www.ultracart.com/api/ for all the expansion fields available
opts = {
  '_expand' => 'item,summary,billing,shipping'
}

begin
  api_response = order_api.get_orders_by_rma(rma, opts)

  # Check for errors
  if api_response.error
    puts "Developer Message: #{api_response.error.developer_message}"
    puts "User Message: #{api_response.error.user_message}"
    exit
  end

  orders = api_response.orders

  puts "Found #{orders.length} order(s) with RMA #{rma}"
  orders.each do |order|
    puts order.inspect
  end
rescue StandardError => e
  puts "An error occurred: #{e.message}"
end
