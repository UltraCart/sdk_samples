from ultracart.apis import CheckoutApi
from ultracart.models import CartFinalizeOrderRequest, CartFinalizeOrderRequestOptions
from samples import api_client
from flask import request, redirect

# Reference Implementation: https://github.com/UltraCart/responsive_checkout

# Note: You probably should NOT be using this method.  Use handoffCart() instead.
# This method is a server-side only (no browser key allowed) method for turning a cart into an order.
# It exists for merchants who wish to provide their own upsells, but again, a warning, using this method
# will exclude the customer checkout from a vast and powerful suite of functionality provided free by UltraCart.
# Still, some merchants need this functionality, so here it is.  If you're unsure, you don't need it.  Use handoff.

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

# Assuming you have a function to get cookies in your Python framework
cart_id = request.cookies.get('UltraCartShoppingCartID')  # Replace with your actual cookie handling

if cart_id is None:
    api_response = checkout_api.get_cart(expand=expand)
else:
    api_response = checkout_api.get_cart_by_cart_id(cart_id, expand=expand)
cart = api_response.cart

# TODO - add some items, collect billing and shipping, use hosted fields to collect payment, etc.

finalize_request = CartFinalizeOrderRequest()
finalize_request.cart = cart
finalize_options = CartFinalizeOrderRequestOptions()  # Lots of options here. Contact support if you're unsure what you need.
finalize_request.options = finalize_options

api_response = checkout_api.finalize_order(finalize_request)
# Available properties:
# api_response.successful
# api_response.errors
# api_response.order_id
# api_response.order

print(api_response)