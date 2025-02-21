from flask import request, redirect
from ultracart.apis import CheckoutApi
from ultracart.models import CheckoutHandoffRequest
from samples import api_client

# Reference Implementation: https://github.com/UltraCart/responsive_checkout

# This example uses the getCart code as a starting point, because we must get a cart to handoff a cart.
# Here, we are handing off the cart to the ultracart engine with an operation of 'view', meaning that we
# simply added some items to the cart and wish for UltraCart to gather the remaining customer information
# as part of a normal checkout operation.
# Valid operations are: "view", "checkout", "paypal", "paypalcredit", "affirm", "sezzle"
# Besides "view", the other operations are finalizers.
# "checkout": finalize the transaction using a customer's personal credit card (traditional checkout)
# "paypal": finalize the transaction by sending the customer to PayPal

checkout_api = CheckoutApi(api_client())

expand = "items"  # for this example, we're just getting a cart to insert some items into it.

cart_id = request.cookies.get('UltraCartShoppingCartID')

if cart_id is None:
    api_response = checkout_api.get_cart(expand=expand)
else:
    api_response = checkout_api.get_cart_by_cart_id(cart_id, expand=expand)
cart = api_response.cart

handoff_request = CheckoutHandoffRequest()
handoff_request.cart = cart
handoff_request.operation = "view"
handoff_request.error_return_url = "/some/page/on/this/python/server/that/can/handle/errors/if/ultracart/encounters/an/issue/with/this/cart"
handoff_request.error_parameter_name = "uc_error"  # name this whatever the script supplied in error_return_url will check for in request.args
handoff_request.secure_host_name = "mystorefront.com"  # set to desired storefront. some merchants have multiple storefronts
api_response = checkout_api.handoff_cart(handoff_request, expand=expand)

if api_response.errors:
    # TODO: handle errors that might happen before handoff and manage those
    pass
else:
    redirect_url = api_response.redirect_to_url
    # return redirect(redirect_url)