require 'ultracart_api'
require_relative '../constants'

# getOrderEdiDocuments returns back all EDI documents associated with an order.
#
# Possible Errors:
# Order.channelPartnerOid is null -> "Order is not associated with an EDI channel partner."
order_api = UltracartClient::OrderApi.new_using_api_key(Constants::API_KEY)

order_id = 'DEMO-0009104976'

begin
  api_response = order_api.get_order_edi_documents(order_id)
  documents = api_response.edi_documents

  # Using inspect instead of var_dump for Ruby-style object representation
  puts documents.inspect
rescue StandardError => e
  puts "An error occurred: #{e.message}"
end