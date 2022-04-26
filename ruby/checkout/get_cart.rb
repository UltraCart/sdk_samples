# frozen_string_literal: true

require 'json'
require 'yaml'
require 'ultracart_api'
require '../Constants'

api = UltracartClient::CheckoutApi.new_using_api_key(Constants::API_KEY, false, false)

# this example is the same for both get_cart.rb and get_cart_by_id.rb.  They work as a pair and are called
# depending on the presence of an existing cart id or not.  For new carts, getCart() is used.  For existing
# carts, getCartByCartId(cart_id) is used.

expansion = 'items' # for this example, we're just getting a cart to insert some items into it.

# do you have the cart id from a cookie or some other server side state engine?
cart_id = nil
# run this example once to get a cart id, then you can add it here to test.
# the cart id below will not work for you.
# cart_id = 'C6A8693A3C78C6017FDA7A50EE380100'

api_response = if cart_id.nil?
                 api.get_cart({ '_expand': expansion })
               else
                 api.get_cart_by_cart_id(cart_id, { '_expand': expansion })
               end

cart = api_response.cart

puts cart.to_yaml
