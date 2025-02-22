require 'ultracart_api'
require_relative '../constants'
require_relative './item_functions'

begin
  # Of the two getItem methods, you'll probably always use getItemByMerchantItemId instead of this one.
  # Most item work is done with the item id, not the item oid. The latter is only meaningful as a primary
  # key in the UltraCart databases. But here is an example of using getItem(). We take the long route here
  # of retrieving the item using getItemByMerchantItemId to obtain the oid rather than hard-coding it.
  # We do this because these samples are used in our quality control system and run repeatedly.

  # Insert a sample item
  item_id = insert_sample_item

  # Initialize APIs
  item_api = UltracartClient::ItemApi.new_using_api_key(Constants::API_KEY)
  customer_api = UltracartClient::CustomerApi.new_using_api_key(Constants::API_KEY)

  # Retrieve item by merchant item ID (base object only)
  base_response = item_api.get_item_by_merchant_item_id(item_id, opts = { '_expand' => nil, '_placeholders' => false })
  item = base_response.item

  merchant_item_oid = item.merchant_item_oid

  # Possible expansion values documented in comments
  # Expansion demonstrates accessing product reviews
  expand_options = "reviews,reviews.individual_reviews"

  # Retrieve full item details with expansions
  full_response = item_api.get_item(merchant_item_oid, opts = { '_expand' => expand_options, '_placeholders' => false })
  full_item = full_response.item

  # Access item reviews
  item_reviews = full_item.reviews
  individual_reviews = item_reviews.individual_reviews

  # Iterate through individual reviews
  individual_reviews.each do |individual_review|
    # Access rating names and scores (configurable by merchant)
    rating_name = individual_review.get_rating_name1
    rating_score = individual_review.get_rating_score1

    # Retrieve reviewer information (cautiously to avoid API call limits)
    customer_response = customer_api.get_customer(
      individual_review.customer_profile_oid,
      opts = { '_expand' => "reviewer" }
    )
    customer = customer_response.customer
    reviewer = customer.reviewer
  end

  # Output the retrieved item
  puts 'The following item was retrieved via getItem():'
  p full_item

  # Clean up sample item
  delete_sample_item(merchant_item_oid)

rescue UltracartClient::ApiException => e
  puts 'An ApiException occurred. Please review the following error:'
  p e # change_me: handle gracefully
  exit 1
end