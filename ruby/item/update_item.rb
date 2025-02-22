#!/usr/bin/env ruby
# frozen_string_literal: true

require 'ultracart_api'
require_relative '../constants'
require_relative './item_functions'

begin
  # Insert a sample item
  item_id = insert_sample_item()

  # Initialize the Item API
  item_api = UltracartClient::ItemApi.new_using_api_key(Constants::API_KEY)

  # See one of the getItem or getItems samples for possible expansion values
  # See also: https://www.ultracart.com/api/#resource_item.html
  opts = {
    '_expand' => 'pricing',
    '_placeholders' => false
  }

  # Retrieve the item
  api_response = item_api.get_item_by_merchant_item_id(item_id, opts)
  item = api_response.item
  original_price = item.pricing.cost

  # Update the price of the item
  item_pricing = item.pricing
  item_pricing.cost = 12.99

  # Update the item
  api_response = item_api.update_item(item.merchant_item_oid, item, opts)
  updated_item = api_response.item

  # Output the price changes
  puts "Original Price: #{original_price}"
  puts "Updated Price: #{updated_item.pricing.cost}"

  # Delete the sample item
  delete_sample_item(item_id)

rescue UltracartClient::ApiError => e
  puts 'An ApiException occurred. Please review the following error:'
  p e
  exit(1)

end