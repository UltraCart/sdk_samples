require 'ultracart_api'
require_relative '../constants'

# Increase execution time for potentially long-running script
# Note: Ruby uses different methods for timeout management
# You may need to adjust based on your specific Ruby environment

# This example illustrates how to retrieve items. When dealing with items, please note that categories are
# essentially folders to organize and store items. They are only used for that purpose and play no role in
# the checkout process or in the storefront display of items. So you may organize your items as best serves
# you. We're often asked why we use the word 'category' instead of 'folder'. We started down the road of
# item management 27 years ago with the word 'category', and it's too much trouble to change. So items are
# managed by categories, not folders. But they are folders. :)
#
# The call takes two possible parameters:
# 1) parentCategoryId: This is a number which uniquely identifies a category in our system. Not easy to determine.
# 2) parentCategoryPath: This is the folder path you wish to retrieve, starting with a forward slash "/"
# If you provide neither of these values, all items are returned.

# Method to retrieve a chunk of items
def get_item_chunk(item_api, offset, limit)
  # The real devil in the getItem calls is the expansion, making sure you return everything you need without
  # returning everything since these objects are extremely large.
  # These are the possible expansion values:
  #
  # accounting                      amember                     auto_order                      auto_order.steps
  # ccbill                          channel_partner_mappings    chargeback                      checkout
  # content                         content.assignments         content.attributes              content.multimedia
  # content.multimedia.thumbnails   digital_delivery            ebay                            email_notifications
  # enrollment123                   gift_certificate            google_product_search           kit_definition
  # identifiers                     instant_payment_notifications   internal                    options
  # payment_processing              physical                    pricing                         pricing.tiers
  # realtime_pricing                related                     reporting                       restriction
  # reviews                         salesforce                  shipping                        shipping.cases
  # tax                             third_party_email_marketing variations                      wishlist_member
  # shipping.destination_markups
  # shipping.destination_restrictions
  # shipping.distribution_centers
  # shipping.methods
  # shipping.package_requirements

  # Just some random ones. Contact us if you're unsure
  expand = "kit_definition,options,shipping,tax,variations"

  # Prepare options for API call
  opts = {
    '_parent_category_id' => nil,
    '_parent_category_path' => nil,
    '_limit' => limit,
    '_offset' => offset,
    '_since' => nil,
    '_sort' => nil,
    '_expand' => expand,
    '_placeholders' => false
  }

  # Retrieve items
  api_response = item_api.get_items(opts)

  # Return items or empty array if none found
  api_response.items || []
end

begin
  # Initialize item API
  item_api = UltracartClient::ItemApi.new_using_api_key(Constants::API_KEY)

  # Pagination variables
  items = []
  iteration = 1
  offset = 0
  limit = 200
  more_records_to_fetch = true

  # Fetch items in chunks
  while more_records_to_fetch
    puts "executing iteration #{iteration}"

    chunk_of_items = get_item_chunk(item_api, offset, limit)
    items += chunk_of_items
    offset += limit
    more_records_to_fetch = chunk_of_items.length == limit
    iteration += 1
  end

  # Output will be verbose...
  p items

rescue UltracartClient::ApiException => e
  puts "ApiException occurred on iteration #{iteration}"
  p e
  exit 1
end