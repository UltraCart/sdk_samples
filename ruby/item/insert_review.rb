#!/usr/bin/env ruby
# frozen_string_literal: true

require 'ultracart_api'
require_relative '../constants'
require_relative './item_functions'

begin
  # To insert a review, you'll need an item's OID (Object Identifier) first.  So for this example, we create
  # a sample item first, then retrieve it by item id to fetch the item oid.
  item_id = insert_sample_item()

  # Initialize the Item API
  item_api = UltracartClient::ItemApi.new_using_api_key(Constants::API_KEY)

  # Expand string is 'reviews' because we'll need to update the sample item's review template below.
  # List of expansions for item object: https://www.ultracart.com/api/#resource_item.html
  opts = {
    '_expand' => 'reviews'
  }

  # Retrieve the item by merchant item ID
  item_response = item_api.get_item_by_merchant_item_id(item_id, opts)
  item = item_response.item
  item_oid = item.merchant_item_oid

  # The target item must have a review template associated before you may attach a review.
  # You may create a review template here:
  # https://secure.ultracart.com/merchant/item/review/reviewTemplateListLoad.do
  # We're using a review template from our development system and it will not work for you.
  # Once you have a review template, update your item either via our gui or the rest api.
  # GUI: secure.ultracart.com -> Home -> Items -> <your item> -> Edit -> Review tab
  # Since we're using a sample item we just created above, we'll update via the rest api.
  # The rest api requires the review template oid, which is found on the template screen

  review_template_oid = 402
  reviews = UltracartClient::ItemReviews.new(review_template_oid: review_template_oid)
  item.reviews = reviews
  item = item_api.update_item(item_oid, item, opts).item

  # You will need to know what your product review looks like.
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

  # Insert the review and update our local variable to see how the review looks now.
  review = item_api.insert_review(item_oid, review).review

  # Output the review object
  p review

  # This will clean up the sample item, but you may wish to review the item in the backend or on your website first.
  # delete_sample_item(item_id)

rescue UltracartClient::ApiError => e
  puts 'An ApiException occurred. Please review the following error:'
  p e
  exit(1)

end