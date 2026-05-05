from ultracart.apis import CheckoutApi
from samples import api_client
from flask import session, request

# Reference Implementation: https://github.com/UltraCart/responsive_checkout
# For a given cart id (the cart should be fully updated in UltraCart), returns back the json object
# needed to proceed with an Affirm checkout. See https://www.affirm.com/ for details about Affirm.
# This sample does not show the construction of the affirm checkout widgets. See the affirm api for those examples.

checkout_api = CheckoutApi(api_client())

# this should be retrieved from a session or cookie
cart_id = '7FD88BAC1FEC55019A17AF331A800100'

api_response = checkout_api.get_affirm_checkout(cart_id)
if hasattr(api_response, 'errors') and api_response.errors is not None:
    # TODO: display errors to customer about the failure
    for error in api_response.errors:
        print(error)
else:
    print(api_response.checkout_json)  # this is the object to send to Affirm.