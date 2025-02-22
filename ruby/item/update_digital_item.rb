#!/usr/bin/env ruby
# frozen_string_literal: true

require 'ultracart_api'
require_relative '../constants'
require_relative './item_functions'

begin
  # Insert a sample digital item
  digital_item_oid = insert_sample_digital_item()

  # Initialize the Item API
  item_api = UltracartClient::ItemApi.new_using_api_key(Constants::API_KEY)

  # Retrieve the digital item
  api_response = item_api.get_digital_item(digital_item_oid)
  digital_item = api_response.digital_item

  # Update the digital item details
  digital_item.description = "I have updated the description to this sentence."
  digital_item.click_wrap_agreement = "You hereby agree that the earth is round.  No debate."

  # Update the digital item
  item_api.update_digital_item(digital_item_oid, digital_item)

  # Delete the sample digital item
  delete_sample_digital_item(digital_item_oid)

rescue UltracartClient::ApiError => e
  puts 'An ApiException occurred. Please review the following error:'
  p e
  exit(1)

end