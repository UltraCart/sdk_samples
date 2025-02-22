require 'ultracart_api'
require_relative '../constants'

=begin
Retrieves all user reviews for an item.

The merchant_item_oid is a unique identifier used by UltraCart. If you do not know your item's oid, call
ItemApi.get_item_by_merchant_item_id() to retrieve the item, and then its oid item.merchant_item_oid
=end

# Initialize the item API
item_api = UltracartClient::ItemApi.new_using_api_key(Constants::API_KEY)

# Set merchant item OID
merchant_item_oid = 123456

begin
  # Get reviews for the specified merchant item
  api_response = item_api.get_reviews(merchant_item_oid)

  # Check for errors
  if api_response.error
    warn api_response.error.developer_message
    warn api_response.error.user_message
    exit
  end

  # Print each review
  api_response.reviews.each do |review|
    p review
  end

rescue UltracartClient::ApiError => e
  warn "API Error: #{e.message}"
  exit(1)
end