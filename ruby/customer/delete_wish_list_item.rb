#!/usr/bin/env ruby

# Require necessary files
require 'ultracart_api'
require_relative '../constants'
require_relative 'customer_functions'
require_relative '../item/item_functions'

# The wishlist methods allow management of a customer's wishlist.
# This includes:
#   - deleteWishListItem
#   - getCustomerWishList
#   - getCustomerWishListItem
#   - insertWishListItem
#   - updateWishListItem
# These methods provide a standard CRUD interface.
#
# You'll need merchant_item_oids to insert wishlist items. If you don't know the oids,
# call ItemApi.getItemByMerchantItemId() to retrieve the item, then get item.merchant_item_oid
#
# Note: Priority of wishlist item, 3 being low priority and 5 is high priority.

begin
  # Initialize the customer API
  customer_api = UltracartClient::CustomerApi.new_using_api_key(Constants::API_KEY)

  # Create a few items first
  first_item_oid = insert_sample_item_and_get_oid
  second_item_oid = insert_sample_item_and_get_oid

  # Create a customer
  customer_oid = insert_sample_customer

  # TODO: If you don't know the customer oid, use getCustomerByEmail() to retrieve the customer.

  # Add some wish list items
  first_wish_item = UltracartClient::CustomerWishListItem.new(
    customer_profile_oid: customer_oid,
    merchant_item_oid: first_item_oid,
    comments: "I really want this for my birthday",
    priority: 3 # Priority of wishlist item, 3 being low priority and 5 is high priority
  )
  first_created_wish_item = customer_api.insert_wish_list_item(customer_oid, first_wish_item)

  second_wish_item = UltracartClient::CustomerWishListItem.new(
    customer_profile_oid: customer_oid,
    merchant_item_oid: second_item_oid,
    comments: "Christmas Idea!",
    priority: 5 # Priority of wishlist item, 3 being low priority and 5 is high priority
  )
  second_created_wish_item = customer_api.insert_wish_list_item(customer_oid, second_wish_item)

  # Retrieve one wishlist item again
  first_created_wish_item_copy = customer_api.get_customer_wish_list_item(
    customer_oid,
    first_created_wish_item.customer_wishlist_item_oid
  ).wishlist_item

  # Retrieve all wishlist items
  all_wish_list_items = customer_api.get_customer_wish_list(customer_oid).wishlist_items

  # Update an item
  second_created_wish_item.priority = 4
  updated_second_wish_item = customer_api.update_wish_list_item(
    customer_oid,
    second_created_wish_item.customer_wishlist_item_oid,
    second_created_wish_item
  )

  # Delete a wish list item
  customer_api.delete_wish_list_item(
    customer_oid,
    first_created_wish_item.customer_wishlist_item_oid
  )

  # Clean up
  delete_sample_customer(customer_oid)
  delete_sample_item_by_oid(first_item_oid)
  delete_sample_item_by_oid(second_item_oid)

rescue StandardError => e
  # Handle any exceptions that occur during the process
  puts 'An exception occurred. Please review the following error:'
  p e
  exit(1)
end

# Ensure a carriage return at the end of the file