#!/usr/bin/env ruby
# frozen_string_literal: true

require 'ultracart_api'
require_relative '../constants'
require_relative './item_functions'

begin
  # Insert two sample items
  item_id1 = insert_sample_item()
  item_id2 = insert_sample_item()

  # Initialize the Item API
  item_api = UltracartClient::ItemApi.new_using_api_key(Constants::API_KEY)

  # See one of the getItem or getItems samples for possible expansion values
  # See also: https://www.ultracart.com/api/#resource_item.html
  opts = {
    '_expand' => 'pricing',
    '_placeholders' => false
  }

  # Retrieve the items
  api_response = item_api.get_item_by_merchant_item_id(item_id1, opts)
  item1 = api_response.item
  api_response = item_api.get_item_by_merchant_item_id(item_id2, opts)
  item2 = api_response.item

  # Update the prices of the items
  item1.pricing.cost = 12.99
  item2.pricing.cost = 14.99

  # Create items request for bulk update
  update_items_request = UltracartClient::ItemsRequest.new(items: [item1, item2])

  # Update multiple items
  api_response = item_api.update_items(update_items_request, opts.merge('_check_groups' => false))

  # Delete the sample items
  delete_sample_item(item_id1)
  delete_sample_item(item_id2)

rescue UltracartClient::ApiError => e
  puts 'An ApiException occurred. Please review the following error:'
  p e
  exit(1)

end