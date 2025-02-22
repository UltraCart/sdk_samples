require 'ultracart_api'
require_relative '../constants'
require_relative './item_functions'

begin
  # Please Note!
  # Digital Items are not normal items you sell on your site.  They are digital files that you may add to
  # a library and then attach to a normal item as an accessory or the main item itself.
  # See: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1376485/Digital+Items

  # Create a sample digital item to retrieve
  digital_item_oid = insert_sample_digital_item

  # Initialize the item API
  item_api = UltracartClient::ItemApi.new_using_api_key(Constants::API_KEY)

  # Prepare API call parameters
  opts = {
    '_limit' => 100,
    '_offset' => 0,
    '_since' => nil,  # digital items do not use since. leave as nil.
    '_sort' => nil,   # if nil, use default of original_filename
    '_expand' => nil, # digital items have no expansion. leave as nil. this value is ignored
    '_placeholders' => nil # digital items have no placeholders. leave as nil.
  }

  # Retrieve digital items
  api_response = item_api.get_digital_items(opts)
  digital_items = api_response.digital_items # assuming this succeeded

  # Output retrieved digital items
  puts 'The following items were retrieved via getDigitalItems():'
  digital_items.each do |digital_item|
    p digital_item
  end

rescue UltracartClient::ApiException => e
  puts 'An ApiException occurred. Please review the following error:'
  p e # change_me: handle gracefully
  exit 1
end