require 'ultracart_api'
require_relative '../constants'
require 'base64'

=begin
    generatePackingSlip accepts a distribution center code and order_id and returns back a base64 encoded byte array pdf.
    Both the dc code and order_id are needed because an order may have multiple items shipping via different DCs.

    You will need the distribution center (DC) code.  UltraCart allows for multiple DC and the code is a
    unique short string you assign to a DC as an easy mnemonic.

    For more information about UltraCart distribution centers, please see:
    https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377114/Distribution+Center

    If you do not know your DC code, query a list of all DC and print them out.
    result = fulfillment_api.get_distribution_centers
    puts result.inspect

=end

fulfillment_api = UltracartClient::FulfillmentApi.new_using_api_key(Constants::API_KEY)

distribution_center_code = 'RAMI'
orders_id = 'DEMO-12345'

begin
  # limit is 500 inventory updates at a time.  batch them if you're going large.
  api_response = fulfillment_api.generate_packing_slip(distribution_center_code, orders_id)
  base64_pdf = api_response.pdf_base64
  decoded_pdf = Base64.decode64(base64_pdf)
  File.write('packing_slip.pdf', decoded_pdf)

  puts "done"
rescue UltracartClient::ApiError => e
  # update inventory failed. examine the reason.
  puts "Exception when calling FulfillmentApi->generate_packing_slip: #{e.message}"
  exit
end