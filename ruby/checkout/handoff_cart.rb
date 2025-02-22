require 'ultracart_api'
require_relative '../constants'

# Reference Implementation: https://github.com/UltraCart/responsive_checkout

# This example uses the get_cart.rb code as a starting point because we must get a cart to hand off a cart.
# Here, we are handing off the cart to the UltraCart engine with an operation of 'view', meaning that we
# simply added some items to the cart and wish for UltraCart to gather the remaining customer information
# as part of a normal checkout operation.
# Valid operations are: "view", "checkout", "paypal", "paypalcredit", "affirm", "sezzle"
# Besides "view", the other operations are finalizers.
# "checkout": Finalize the transaction using a customer's personal credit card (traditional checkout)
# "paypal": Finalize the transaction by sending the customer to PayPal

# get_cart.rb code start ----------------------------------------------------------------------------

# This example is the same for both get_cart.rb and get_cart_by_cart_id.rb. They work as a pair and are called
# depending on the presence of an existing cart ID or not. For new carts, get_cart() is used. For existing
# carts, get_cart_by_cart_id(cart_id) is used.

checkout_api = UltracartClient::CheckoutApi.new_using_api_key(Constants::API_KEY)

expansion = "items" # For this example, we're just getting a cart to insert some items into it.

cart_id = nil
cart_id = ENV['HTTP_COOKIE'].scan(/UltraCartShoppingCartID=([^;]+)/).flatten.first if ENV['HTTP_COOKIE']

cart = nil
if cart_id.nil?
  api_response = checkout_api.get_cart(expansion: expansion)
else
  api_response = checkout_api.get_cart_by_cart_id(cart_id, expansion: expansion)
end
cart = api_response.cart

# get_cart.rb code end ----------------------------------------------------------------------------

# Although the above code checks for a cookie and retrieves or creates a cart based on the cookie presence, typically
# a Ruby script calling the handoff() method will have an existing cart, so you may wish to check for a cookie and
# redirect if there isn't one. However, it is possible that you wish to create a cart, update it, and hand it off
# to UltraCart all within one script, so we've left the conditional cart creation calls intact.

handoff_request = UltracartClient::CheckoutHandoffRequest.new
handoff_request.cart = cart
handoff_request.operation = "view"
handoff_request.error_return_url = "/some/page/on/this/ruby/server/that/can/handle/errors/if/ultracart/encounters/an/issue/with/this/cart.rb"
handoff_request.error_parameter_name = "uc_error" # Name this whatever the script supplied in ->setErrorReturnUrl() will check for in the params.
handoff_request.secure_host_name = "mystorefront.com" # Set to desired storefront. Some merchants have multiple storefronts.

api_response = checkout_api.handoff_cart(handoff_request, { '_expand' => expansion })

if !api_response.errors.nil? && !api_response.errors.empty?
  # TODO: Handle errors that might happen before handoff and manage those
else
  redirect_url = api_response.redirect_to_url
  puts "Location: #{redirect_url}\n\n"
end
