require 'ultracart_api'
require_relative '../constants'

# Reference Implementation: https://github.com/UltraCart/responsive_checkout

# This example logs a user OUT of the UltraCart system.
# It assumes the shopping cart has already had a successful login.
# See login sdk_sample for logging in help.
# For new carts, get_cart() is used. For existing carts, get_cart_by_cart_id(cart_id) is used.

checkout_api = UltracartClient::CheckoutApi.new_using_api_key(Constants::API_KEY)

# Note: customer_profile is a required expansion for login to work properly
expansion = "customer_profile,items,billing,shipping,coupons,checkout,payment,summary,taxes"
# Possible Expansion Variables: (see https://www.ultracart.com/api/#resource_checkout.html)

# Create a new cart (change this to an existing if you have one)
cart = checkout_api.get_cart(expansion: expansion).cart

email = 'test@test.com' # Collect this from user.
password = 'ABC123' # Collect this from user.

cart.billing = UltracartClient::CartBilling.new
cart.billing.email = email

login_request = UltracartClient::CartProfileLoginRequest.new
login_request.cart = cart # Will look for billing.email
login_request.password = password

api_response = checkout_api.login(login_request)
cart = api_response.cart

if api_response.success
  checkout_api.logout(cart, { '_expand' => expansion }) # <-- Here is the logout call.
else
  # Notify customer login failed. Until they log in, you can't log them out.
end
