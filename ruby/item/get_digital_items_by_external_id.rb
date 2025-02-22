require 'ultracart_api'
require_relative '../constants'
require_relative './item_functions'

begin
  # Please Note!
  # Digital Items are not normal items you sell on your site.  They are digital files that you may add to
  # a library and then attach to a normal item as an accessory or the main item itself.
  # See: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1376485/Digital+Items

  # Generate a unique external ID
  external_id = SecureRandom.uuid
  puts "My external id is #{external_id}"

  # Create digital item with a specific external id for later use
  digital_item_oid = insert_sample_digital_item(external_id)

  # Initialize the item API
  item_api = UltracartClient::ItemApi.new_using_api_key(Constants::API_KEY)

  # Retrieve digital items by external ID
  api_response = item_api.get_digital_items_by_external_id(external_id)
  digital_items = api_response.digital_items # assuming this succeeded

  # Output retrieved items
  puts 'The following item was retrieved via getDigitalItem():'
  p digital_items

  # Delete the sample digital item
  delete_sample_digital_item(digital_item_oid)

rescue UltracartClient::ApiException => e
  puts 'An ApiException occurred. Please review the following error:'
  p e # change_me: handle gracefully
  exit 1
end