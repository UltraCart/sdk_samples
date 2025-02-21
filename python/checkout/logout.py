from ultracart.apis import CheckoutApi
from ultracart.models import CartBilling, CartProfileLoginRequest
from samples import api_client

# Reference Implementation: https://github.com/UltraCart/responsive_checkout

# This example logs a user OUT of the UltraCart system.
# It assumes the shopping cart has already had a successful login.
# see login sdk_sample for logging in help.
# For new carts, getCart() is used. For existing carts, getCartByCartId(cart_id) is used.

checkout_api = CheckoutApi(api_client())

# Note: customer_profile is a required expansion for login to work properly
expand = "customer_profile,items,billing,shipping,coupons,checkout,payment,summary,taxes"
# Possible Expansion Variables: (see https://www.ultracart.com/api/#resource_checkout.html)

# create a new cart (change this to an existing if you have one)
api_response = checkout_api.get_cart(expand=expand)
cart = api_response.cart

email = 'test@test.com'  # collect this from user
password = 'ABC123'  # collect this from user

cart.billing = CartBilling()
cart.billing.email = email

login_request = CartProfileLoginRequest()
login_request.cart = cart  # will look for billing.email
login_request.password = password

api_response = checkout_api.login(login_request)
cart = api_response.cart

if api_response.success:
    checkout_api.logout(cart, expand=expand)  # <-- Here is the logout call.
else:
    # notify customer login failed. Until they login, you can't logout.
    pass