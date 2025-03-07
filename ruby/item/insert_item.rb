require 'ultracart_api'
require_relative '../constants'
require_relative './item_functions'

begin
  # Create and then delete a sample item
  item_id = insert_sample_item
  delete_sample_item(item_id)

rescue UltracartClient::ApiError => e
  warn 'An ApiException occurred. Please review the following error:'
  p e
  exit(1)
end