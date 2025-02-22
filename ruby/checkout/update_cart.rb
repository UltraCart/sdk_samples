require 'ultracart_api'
require_relative '../constants'

# Reference Implementation: https://github.com/UltraCart/responsive_checkout

checkout_api = UltracartClient::CheckoutApi.new_using_api_key(Constants::API_KEY)

expansion = 'items' # For this example, we're just getting a cart to insert some items into it.

cart_id = nil
cart_id = ENV['HTTP_COOKIE'].to_s[/#{Constants::CART_ID_COOKIE_NAME}=([^;]+)/, 1] if ENV['HTTP_COOKIE']

cart = if cart_id.nil?
         checkout_api.get_cart({_expand: expansion}).cart
       else
         checkout_api.get_cart_by_cart_id(cart_id, {_expand: expansion}).cart
       end

# Get the items array on the cart, creating it if it doesn't exist.
items = cart.items || []

# Create a new item
item = UltracartClient::CartItem.new
item.item_id = 'BASEBALL' # TODO: Adjust the item id
item.quantity = 1 # TODO: Adjust the quantity

# TODO: If your item has options, then you need to create a new UltracartClient::CartItemOption object and push it into the array.
options = []
item.options = options

# Add the item to the items array
items << item

# Update the cart with the new items
cart.items = items

# Push the cart up to save the item
cart_response = checkout_api.update_cart(cart, {_expand: expansion})

# Extract the updated cart from the response
cart = cart_response.cart

# TODO: Set or reset the cart cookie if this is part of a multi-page process. Two weeks is a generous cart ID time.
puts "Set-Cookie: #{Constants::CART_ID_COOKIE_NAME}=#{cart.cart_id}; Path=/; Max-Age=1209600"

puts cart.inspect
