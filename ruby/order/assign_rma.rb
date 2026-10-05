require 'ultracart_api'
require_relative '../constants'

# OrderApi.assign_rma() associates an RMA (return merchandise authorization) number with an order.
# The rma is required, may be at most 30 characters, and is trimmed of whitespace.
# Any existing RMA on the order is replaced, and a merchant note is added to the order recording the change.
# The optional _expand parameter controls how much of the updated order is returned.
# Requires the order_write permission.

order_api = UltracartClient::OrderApi.new_using_api_key(Constants::API_KEY)

order_id = 'DEMO-0009104390'

assign_rma_request = UltracartClient::OrderAssignRmaRequest.new
assign_rma_request.rma = 'RMA-12345'

# see www.ultracart.com/api/ for all the expansion fields available
opts = {
  '_expand' => 'item,summary'
}

begin
  api_response = order_api.assign_rma(order_id, assign_rma_request, opts)

  # Check for errors
  if api_response.error
    puts "Developer Message: #{api_response.error.developer_message}"
    puts "User Message: #{api_response.error.user_message}"
    exit
  end

  order = api_response.order

  puts "RMA #{assign_rma_request.rma} assigned to order #{order.order_id}"
  puts order.inspect
rescue StandardError => e
  puts "An error occurred: #{e.message}"
end
