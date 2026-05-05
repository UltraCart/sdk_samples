from ultracart.apis import CheckoutApi
from ultracart.models import Cart, CartShipping
from samples import api_client

# Reference Implementation: https://github.com/UltraCart/responsive_checkout
# Takes a postal code and returns back a city and state (US Only)

checkout_api = CheckoutApi(api_client())
cart = checkout_api.get_cart().cart

# this cart is lazy, therefore it's not real (yet).
# so call update cart before calling cityState to persist it on the server side.
cart = checkout_api.update_cart(cart).cart

# cart_id = '123456789123456789123456789123456789'  # you should have the cart id from session or cookie
# cart = Cart()
# cart.cart_id = cart_id  # required
cart.shipping = CartShipping()
cart.shipping.postal_code = '44233'

api_response = checkout_api.city_state(cart)
if hasattr(api_response, 'city'):
    print(f'City: {api_response.city}')
else:
    print("No city returned.")

if hasattr(api_response, 'state'):
    print(f'State: {api_response.state}')
else:
    print("No state returned.")