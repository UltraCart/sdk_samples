require 'ultracart_api'
require_relative '../constants'

# Reference Implementation: https://github.com/UltraCart/responsive_checkout
# Retrieves items related to the items within the cart, in addition to another item ID you supply.
# Item relations are configured in the UltraCart backend.
# See: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377171/Related+Items

checkout_api = UltracartClient::CheckoutApi.new_using_api_key(Constants::API_KEY)

expansion = 'customer_profile,items,billing,shipping,coupons,checkout,payment,summary,taxes'

cart_id = ENV['HTTP_ULTRACARTSHOPPINGCARTID']

cart = if cart_id.nil?
          checkout_api.get_cart({_expand: expansion}).cart
       else
          checkout_api.get_cart_by_cart_id(cart_id, {_expand: expansion}).cart
       end

# TODO - add some items to the cart and update.

items = []
cart_item = UltracartClient::CartItem.new
cart_item.item_id = 'ITEM_ABC'
cart_item.quantity = 1
items << cart_item
cart.items = items

# Update the cart
cart = checkout_api.update_cart(cart, { '_expand' => expansion }).cart

another_item_id = 'ITEM_ZZZ'

api_response = checkout_api.related_items_for_item(another_item_id, cart, { '_expand' => expansion })
related_items = api_response.items

puts related_items.inspect
