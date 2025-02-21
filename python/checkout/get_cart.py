from ultracart.apis import CheckoutApi
from samples import api_client
from flask import request, make_response

# Reference Implementation: https://github.com/UltraCart/responsive_checkout

# this example is the same for both getCart.php and getCartByCartId.php. They work as a pair and are called
# depending on the presence of an existing cart id or not. For new carts, getCart() is used. For existing
# carts, getCartByCartId(cart_id) is used.

checkout_api = CheckoutApi(api_client())

expand = "customer_profile,items,billing,shipping,coupons,checkout,payment,summary,taxes"
# Possible Expansion Variables: (see https://www.ultracart.com/api/#resource_checkout.html
"""
affiliate                   checkout                            customer_profile
billing                     coupons                             gift
gift_certificate           items.attributes                   items.multimedia
items                       items.multimedia.thumbnails         items.physical
marketing                   payment                                settings.gift
settings.billing.provinces  settings.shipping.deliver_on_date   settings.shipping.estimates
settings.shipping.provinces settings.shipping.ship_on_date     settings.taxes
settings.terms              shipping                           taxes
summary                     upsell_after
"""

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