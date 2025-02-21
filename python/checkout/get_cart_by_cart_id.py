from ultracart.apis import CheckoutApi
from samples import api_client
from flask import request, make_response

# Reference Implementation: https://github.com/UltraCart/responsive_checkout

# this example is the same for both getCart.php and getCartByCartId.php. They work as a pair and are called
# depending on the presence of an existing cart id or not. For new carts, getCart() is used. For existing
# carts, getCartByCartId(cart_id) is used.

checkout_api = CheckoutApi(api_client())

expand = "items"  # for this example, we're just getting a cart to insert some items into it.

cart_id = request.cookies.get("UltraCartShoppingCartID")

if cart_id is None:
    api_response = checkout_api.get_cart(expand=expand)
else:
    api_response = checkout_api.get_cart_by_cart_id(cart_id, expand=expand)

cart = api_response.cart

# TODO: set or re-set the cart cookie if this is part of a multi-page process. two weeks is a generous cart id time.
response = make_response(str(cart))
response.set_cookie("UltraCartShoppingCartID", cart.cart_id, max_age=1209600, path="/")

print(cart)