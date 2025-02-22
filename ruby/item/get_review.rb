require 'ultracart_api'
require_relative '../constants'

=begin
Retrieves a specific user review for an item. This would most likely be used by a merchant who has cached all
reviews on a separate site and then wishes to update a particular review. It's always best to "get" the object,
make changes to it, then call the update instead of trying to recreate the object from scratch.

The merchant_item_oid is a unique identifier used by UltraCart. If you do not know your item's oid, call
ItemApi.get_item_by_merchant_item_id() to retrieve the item, and then it's oid item.merchant_item_oid

The review_oid is a unique identifier used by UltraCart. If you do not know a review's oid, call
ItemApi.get_reviews() to get all reviews where you can then grab the oid from an item.
=end

# Initialize the item API
item_api = UltracartClient::ItemApi.new_using_api_key(Constants::API_KEY)

# Set merchant item and review OIDs
merchant_item_oid = 123456
review_oid = 987654

# Get the review with opts hash
begin
  api_response = item_api.get_review(review_oid, merchant_item_oid)

  # Check for errors
  if api_response.error
    warn api_response.error.developer_message
    warn api_response.error.user_message
    exit
  end

  # Print the review
  p api_response.review

rescue UltracartClient::ApiError => e
  warn "API Error: #{e.message}"
  exit(1)
end