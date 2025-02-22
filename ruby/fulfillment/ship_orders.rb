require_relative '../constants'
require 'ultracart_api'

fulfillment_api = UltracartClient::FulfillmentApi.new_using_api_key(Constants::API_KEY)

# shipOrders informs UltraCart that you (the fulfillment center) have shipped an order and allows you to provide
# UltraCart with tracking information.
#
# You will need the distribution center (DC) code.  UltraCart allows for multiple DC and the code is a
# unique short string you assign to a DC as an easy mnemonic.
#
# For more information about UltraCart distribution centers, please see:
# https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377114/Distribution+Center
#
# If you do not know your DC code, query a list of all DC and print them out.
# result = fulfillment_api.get_distribution_centers
# puts result.inspect
#
# A successful call will receive back a status code 204 (No Content).
#
# Possible Errors:
# More than 100 order ids provided -> "shipments can not contain more than 100 records at a time"

distribution_center_code = 'RAMI'
shipment = UltracartClient::FulfillmentShipment.new
shipment.order_id = 'DEMO-12345'
shipment.tracking_numbers = ['UPS-1234567890', 'USPS-BLAH-BLAH-BLAH'] # this order had two boxes.
shipment.shipping_cost = 16.99 # the actual cost to ship this order
shipment.fulfillment_fee = 8.99 # this fulfillment center is kinda pricey.
shipment.package_cost = 11.99 # 11.99?  we use only the finest packaging.

shipments = [shipment] # up to 100 shipments per call

begin
  # limit is 100 shipments updates at a time.
  fulfillment_api.ship_orders(distribution_center_code, shipments)
  puts "done"
rescue UltracartClient::ApiException => e
  # update inventory failed.  examine the reason.
  puts "Exception when calling FulfillmentApi->shipOrders: #{e.message}"
  exit
end