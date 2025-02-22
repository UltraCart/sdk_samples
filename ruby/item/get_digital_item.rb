require 'ultracart_api'
require_relative '../constants'
require_relative './item_functions'

begin
  # Digital Items are not normal items you sell on your site. They are digital files that you may add to
  # a library and then attach to a normal item as an accessory or the main item itself.
  # See: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1376485/Digital+Items

  digital_item_oid = insert_sample_digital_item # create an item so I can get an item
  item_api = UltracartClient::ItemApi.new_using_api_key(Constants::API_KEY)

  opts = { '_expand' => nil }
  api_response = item_api.get_digital_item(digital_item_oid, opts)
  digital_item = api_response.digital_item # assuming this succeeded

  puts 'The following item was retrieved via get_digital_item():'
  p digital_item

  delete_sample_digital_item(digital_item_oid)

rescue UltracartClient::ApiException => e
  puts 'An ApiException occurred. Please review the following error:'
  p e
  exit(1)
end
