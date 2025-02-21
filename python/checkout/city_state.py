from ultracart.apis import CheckoutApi
from ultracart.models import Cart, CartShipping
from samples import api_client

# Reference Implementation: https://github.com/UltraCart/responsive_checkout
# Takes a postal code and returns back a city and state (US Only)

checkout_api = CheckoutApi(api_client())

cart_id = '123456789123456789123456789123456789'  # you should have the cart id from session or cookie
cart = Cart()
cart.cart_id = cart_id  # required
cart.shipping = CartShipping()
cart.shipping.postal_code = '44233'

api_response = checkout_api.city_state(cart)
print(f'City: {api_response.city}')
print(f'State: {api_response.state}')