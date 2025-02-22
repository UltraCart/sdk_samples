require 'ultracart_api'
require_relative '../constants'
require_relative './item_functions'

begin
  # Of the two getItem methods, you'll probably always use getItemByMerchantItemId instead of this one.
  # Most item work is done with the item id, not the item oid. The latter is only meaningful as a primary
  # key in the UltraCart databases. But here is an example of using getItem(). We take the long route here
  # of retrieving the item using getItemByMerchantItemId to obtain the oid rather than hard-coding it. We do this
  # because these samples are used in our quality control system and run repeatedly.

  # Insert a sample item
  item_id = insert_sample_item

  # Initialize item API
  item_api = UltracartClient::ItemApi.new_using_api_key(Constants::API_KEY)

  # The real devil in the getItem calls is the expansion, making sure you return everything you need without
  # returning everything since these objects are extremely large.
  # These are the possible expansion values:
  #
  # accounting
  # amember
  # auto_order
  # auto_order.steps
  # ccbill
  # channel_partner_mappings
  # chargeback
  # checkout
  # content
  # content.assignments
  # content.attributes
  # content.multimedia
  # content.multimedia.thumbnails
  # digital_delivery
  # ebay
  # email_notifications
  # enrollment123
  # gift_certificate
  # google_product_search
  # kit_definition
  # identifiers
  # instant_payment_notifications
  # internal
  # options
  # payment_processing
  # physical
  # pricing
  # pricing.tiers
  # realtime_pricing
  # related
  # reporting
  # restriction
  # reviews
  # salesforce
  # shipping
  # shipping.cases
  # shipping.destination_markups
  # shipping.destination_restrictions
  # shipping.distribution_centers
  # shipping.methods
  # shipping.package_requirements
  # tax
  # third_party_email_marketing
  # variations
  # wishlist_member
  #
  # just some random ones. contact us if you're unsure
  expand = "kit_definition,options,shipping,tax,variations"

  # Retrieve item by merchant item ID with expansions
  api_response = item_api.get_item_by_merchant_item_id(
    item_id,
    opts = { '_expand' => expand, '_placeholders' => false }
  )
  item = api_response.item

  # Output the retrieved item
  puts 'The following item was retrieved via getItemByMerchantItemId():'
  p item

  # Clean up sample item
  delete_sample_item(item_id)

rescue UltracartClient::ApiException => e
  puts 'An ApiException occurred. Please review the following error:'
  p e # change_me: handle gracefully
  exit 1
end