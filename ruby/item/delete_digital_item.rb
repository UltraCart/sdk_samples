require 'ultracart_api'
require_relative '../constants'
require_relative './item_functions'

begin
  digital_item_oid = insert_sample_digital_item
  delete_sample_digital_item(digital_item_oid)
rescue UltracartClient::ApiException => e
  puts 'An ApiException occurred. Please review the following error:'
  p e
  exit(1)
end