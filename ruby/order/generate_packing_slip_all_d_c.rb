require 'ultracart_api'
require_relative '../constants'

# OrderApi.generatePackingSlipAllDC() is a method that might be used by a fulfillment center or distribution
# center to generate a packing slip to include with a shipment.  This method will return a packing slip for
# an order for all distribution centers involved.
order_api = UltracartClient::OrderApi.new_using_api_key(Constants::API_KEY)

order_id = 'DEMO-0009104390'

begin
  api_response = order_api.generate_packing_slip_all_dc(order_id)

  # Check for errors
  if api_response.error
    puts "Developer Message: #{api_response.error.developer_message}"
    puts "User Message: #{api_response.error.user_message}"
    exit
  end

  # The packing slip will return as a base64 encoded
  # unpack, save off, email, whatever.
  base64_packing_slip = api_response.pdf_base64

  puts base64_packing_slip
rescue StandardError => e
  puts "An error occurred: #{e.message}"
end