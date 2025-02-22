require 'ultracart_api'
require_relative '../constants'
require_relative './item_functions'

=begin
Digital Items are not normal items you sell on your site. They are digital files that you may add to
a library and then attach to a normal item as an accessory or the main item itself.
See: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1376485/Digital+Items

Retrieves a group of digital items (file information) from the account that are not yet associated with any
actual items. If no parameters are specified, all digital items will be returned. These are
digital files that may be associated with normal items.

Default sort order: original_filename
Possible sort orders: original_filename, description, file_size
=end

begin
  # Create an unassociated digital item
  digital_item_oid = insert_sample_digital_item

  # Initialize the item API
  item_api = UltracartClient::ItemApi.new_using_api_key(Constants::API_KEY)

  # Prepare options for API call
  opts = {
    '_limit' => 100,
    '_offset' => 0,
    '_since' => nil,  # digital items do not use since
    '_sort' => nil,   # defaults to original_filename
    '_expand' => nil, # digital items have no expansion
    '_placeholders' => nil
  }

  # Get unassociated digital items
  api_response = item_api.get_unassociated_digital_items(opts)

  # Print retrieved digital items
  puts 'The following items were retrieved via get_unassociated_digital_items():'
  api_response.digital_items.each do |digital_item|
    p digital_item
  end

rescue UltracartClient::ApiError => e
  warn 'An ApiException occurred. Please review the following error:'
  p e
  exit(1)
end