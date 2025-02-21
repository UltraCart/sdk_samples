from flask import request
from ultracart.apis import CheckoutApi
from ultracart.models import CartItem
from samples import api_client

# Reference Implementation: https://github.com/UltraCart/responsive_checkout

# Retrieves items related to the items within the cart, in addition to another item id you supply.
# Item relations are configured in the UltraCart backend.
# See: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377171/Related+Items

# Note: The returned items have a fixed expansion (only so many item properties are returned). The item expansion is:
# content, content.assignments, content.attributes, content.multimedia, content.multimedia.thumbnails, options, pricing, and pricing.tiers

checkout_api = CheckoutApi(api_client())

expand = "customer_profile,items,billing,shipping,coupons,checkout,payment,summary,taxes"
# Possible Expansion Variables: (see https://www.ultracart.com/api/#resource_checkout.html
"""
affiliate                   checkout                            customer_profile
billing                     coupons                             gift
gift_certificate            items.attributes                   items.multimedia
items                       items.multimedia.thumbnails         items.physical
marketing                   payment                                settings.gift
settings.billing.provinces  settings.shipping.deliver_on_date   settings.shipping.estimates
settings.shipping.provinces settings.shipping.ship_on_date     settings.taxes
settings.terms              shipping                           taxes
summary                     upsell_after
"""

cart_id = request.cookies.get('UltraCartShoppingCartID')

if cart_id is None:
    api_response = checkout_api.get_cart(expand=expand)
else:
    api_response = checkout_api.get_cart_by_cart_id(cart_id, expand=expand)
cart = api_response.cart

# TODO - add some items to the cart and update.

items = []
cart_item = CartItem()
cart_item.item_id = 'ITEM_ABC'
cart_item.quantity = 1
items.append(cart_item)
cart.items = items

# update the cart and assign it back to our variable
cart = checkout_api.update_cart(cart, expand=expand).cart

another_item_id = 'ITEM_ZZZ'

api_response = checkout_api.related_items_for_item(another_item_id, cart, expand=expand)
related_items = api_response.items

print(related_items)