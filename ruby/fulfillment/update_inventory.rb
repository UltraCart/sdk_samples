require_relative '../constants'
require 'ultracart_api'

fulfillment_api = UltracartClient::FulfillmentApi.new_using_api_key(Constants::API_KEY)

# updateInventory is a simple means of updating UltraCart inventory for one or more items (500 max per call)
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
# Possible Errors:
# More than 500 items provided -> "inventories can not contain more than 500 records at a time"

distribution_center_code = 'RAMI'
sku = '9780982021361'
quantity = 9
first_inventory = UltracartClient::FulfillmentInventory.new
first_inventory.item_id = sku
first_inventory.quantity = quantity
inventory_updates = [first_inventory] # for this example, we're only updating one item.

puts inventory_updates.inspect

begin
  # limit is 500 inventory updates at a time.  batch them if you're going large.
  fulfillment_api.update_inventory(distribution_center_code, inventory_updates)
  puts "done"
rescue UltracartClient::ApiException => e
  # update inventory failed.  examine the reason.
  puts "Exception when calling FulfillmentApi->updateInventory: #{e.message}"
  exit
end