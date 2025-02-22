#!/usr/bin/env ruby
# frozen_string_literal: true

require 'ultracart_api'
require_relative '../constants'

=begin
    While UltraCart provides a means for updating item content, it is StoreFront specific.  This method allows for
    item-wide update of content, such as SEO fields. The content attribute has three fields:
    1) name
    2) value
    3) type: boolean,color,definitionlist,html,integer,mailinglist,multiline,rgba,simplelist,string,videolist

    The SEO content has the following names:
    Item Meta Title = "storefrontSEOTitle"
    Item Meta Description = "storefrontSEODescription"
    Item Meta Keywords = "storefrontSEOKeywords"

    The merchant_item_oid is a unique identifier used by UltraCart.  If you do not know your item's oid, call
    ItemApi.getItemByMerchantItemId() to retrieve the item, and then it's oid $item->getMerchantItemOid()

    Success will return back a status code of 204 (No Content)
=end

# Initialize the Item API
item_api = UltracartClient::ItemApi.new_using_api_key(Constants::API_KEY)
merchant_item_oid = 12345

# Create the content attribute
attribute = UltracartClient::ItemContentAttribute.new(
  name: "storefrontSEOKeywords",
  value: 'dog,cat,fish',
  type: "string"
)

# Insert or update the item content attribute
item_api.insert_update_item_content_attribute(merchant_item_oid, attribute)