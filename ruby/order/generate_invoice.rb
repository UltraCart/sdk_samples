# generate_invoice returns back a base64 encoded byte array of the given order's Invoice in PDF format.

require_relative '../constants'
require 'base64'
require 'ultracart_api'

order_api = UltracartClient::OrderApi.new_using_api_key(Constants::API_KEY)

order_id = 'DEMO-0009104976'
api_response = order_api.generate_invoice(order_id)

# the packing slip will return as a base64 encoded
# unpack, save off, email, whatever.
base64_pdf = api_response.get_pdf_base64

decoded_pdf = Base64.decode64(base64_pdf)
File.write('invoice.pdf', decoded_pdf)

# Note: Direct file serving is typically handled by web frameworks in Ruby
# This script just saves the PDF locally
puts 'Invoice PDF has been saved as invoice.pdf'
