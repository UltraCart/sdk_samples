#!/usr/bin/env ruby
# frozen_string_literal: true

require 'ultracart_api'
require_relative '../constants'
require_relative './item_functions'

begin
  # To update a review, you'll need an item's OID (Object Identifier) and the review oid first.

  # If you don't know your oid, call getItemByMerchantItemId() to get your item, then get the oid.
  merchant_item_oid = 99998888
  review_oid = 123456 # This is the particular oid you wish to update.

  # Initialize the Item API
  item_api = UltracartClient::ItemApi.new_using_api_key(Constants::API_KEY)

  # Retrieve the existing review
  review = item_api.get_review(merchant_item_oid, review_oid).review

  # Update the review details
  review = UltracartClient::ItemReview.new(
    title: 'Best Product Ever!',
    review: "I loved this product.  I bought it for my wife and she was so happy she cried.  blah blah blah",
    reviewed_nickname: "Bob420",
    featured: true, # featured? sure. why not? this is a great review.
    rating_name1: 'Durability',
    rating_name2: 'Price',
    rating_name3: 'Performance',
    rating_name4: 'Appearance',
    rating_score1: 4.5,
    rating_score2: 3.5,
    rating_score3: 2.5,
    rating_score4: 1.5,
    overall: 5.0, # hooray!
    reviewer_location: "Southside Chicago",
    status: 'approved'
  )

  # Update the review and retrieve the updated review
  review = item_api.update_review(review_oid, merchant_item_oid, review).review

  # Output the review object
  p review

  # This will clean up the sample item, but you may wish to review the item in the backend or on your website first.
  # delete_sample_item(item_id)

rescue UltracartClient::ApiError => e
  puts 'An ApiException occurred. Please review the following error:'
  p e
  exit(1)

end