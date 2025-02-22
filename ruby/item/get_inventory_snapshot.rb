require 'ultracart_api'
require_relative '../constants'

# Retrieve a list of item inventories.
# This method may be called once every 15 minutes.  More than that will result in a 429 response.

begin
  # Initialize the item API
  item_api = UltracartClient::ItemApi.new_using_api_key(Constants::API_KEY)

  # Retrieve inventory snapshot
  api_response = item_api.get_inventory_snapshot
  inventories = api_response.inventories

  # Output each inventory item
  inventories.each do |inventory|
    p inventory
  end

rescue UltracartClient::ApiException => e
  puts 'An ApiException occurred. Please review the following error:'
  p e # change_me: handle gracefully
  exit 1
end