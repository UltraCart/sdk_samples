from ultracart.apis import CheckoutApi
from ultracart.models import CartBilling, CartProfileRegisterRequest
from samples import api_client

# Reference Implementation: https://github.com/UltraCart/responsive_checkout

# Registers a user in your merchant system. This will create a customer profile.
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
cart.billing.email = email  # this is the username

register_request = CartProfileRegisterRequest()
register_request.cart = cart  # will look for billing.email
register_request.password = password

api_response = checkout_api.register(register_request)
cart = api_response.cart  # Important! Get the cart from the response.

if api_response.success:
    print('Successfully registered new customer profile!')
else:
    for error in api_response.errors:
        print(error)