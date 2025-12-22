#!/usr/bin/env ruby
# frozen_string_literal: true

require 'ultracart_api'
require_relative '../constants'
require_relative './item_functions'

begin

  # This is important.  What is your distribution center code?
  dc_code = 'DFLT'  # case matters.
  my_inventory_level = 200

  # Insert a sample item
  item_id = insert_sample_item()


  # Initialize the Item API
  item_api = UltracartClient::ItemApi.new_using_api_key(Constants::API_KEY, Constants::VERIFY_SSL, Constants::DEBUG_MODE)

  # See one of the getItem or getItems samples for possible expansion values
  # See also: https://www.ultracart.com/api/#resource_item.html
  opts = {
    :'_expand' => 'shipping.distribution_centers', ### THIS IS CRITICAL ON BOTH THE GET **AND** ESPECIALLY THE UPDATE or you'll wipe item config
    :'_placeholders' => false
  }

  # Retrieve the item
  api_response = item_api.get_item_by_merchant_item_id(item_id, opts)
  item = api_response.item
  pp item
  distribution_centers = item.shipping.distribution_centers
  distribution_centers.each { |distribution_center| distribution_center.inventory_level = my_inventory_level if distribution_center.distribution_center_code == dc_code }

  # Update the item
  api_response = item_api.update_item(item.merchant_item_oid, item, opts)
  updated_item = api_response.item
  pp updated_item

  # Delete the sample item
  # delete_sample_item(item_id)

rescue UltracartClient::ApiError => e
  puts 'An ApiException occurred. Please review the following error:'
  p e
  exit(1)

end