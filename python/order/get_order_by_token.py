from ultracart.apis import OrderApi
from ultracart.model.order_by_token_query import OrderByTokenQuery
from samples import api_client

# OrderApi.get_order_by_token() was created for use within a custom thank-you page.
# The built-in StoreFront thank-you page displays the customer receipt and allows for unlimited customization.
# However, many merchants wish to process the receipt page on their own servers to do custom processing.
#
# See: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377199/Custom+Thank+You+Page+URL
#
# When setting up a custom thank-you URL in the StoreFronts, you will provide a query parameter that will hold
# this order token. You may extract that from the request parameters and then call get_order_by_token()
# to get the order object.

# Create Order API instance
order_api = OrderApi(api_client())

# The expand variable instructs UltraCart how much information to return. The order object is large and
# while it's easily manageable for a single order, when querying thousands of orders, it is useful to reduce
# payload size.
# See www.ultracart.com/api/ for all the expansion fields available (this list below may become stale).
#
# Possible Order Expansions:
# affiliate           affiliate.ledger                    auto_order
# billing             channel_partner                     checkout
# coupon              customer_profile                    digital_order
# edi                 fraud_score                         gift
# gift_certificate    internal                            item
# linked_shipment     marketing                           payment
# payment.transaction quote                               salesforce
# shipping            shipping.tracking_number_details    summary
# taxes

expand = "billing,checkout,coupon,customer_profile,item,payment,shipping,summary,taxes"

# The token will be in a request parameter defined by you within your storefront.
# StoreFront -> Privacy and Tracking -> Advanced -> CustomThankYouUrl
# Example would be: www.mysite.com/receipt?orderToken=[OrderToken]

# TODO: Handle retrieving the order token from request parameters
order_token = "DEMO:T5xAFygRLa0M2ql2zpZ9mEQyLbQjGLfAP/aIdhglmBoFexpK6X74LvF7TR3Q96Q="  # Replace with actual order token

# To generate an order token manually for testing, refer to generate_order_token.py
# TODO: Handle missing order token (e.g., if this page is called incorrectly by a search engine, etc.)

order_token_query = OrderByTokenQuery(order_token=order_token)

# Retrieve order
api_response = order_api.get_order_by_token(order_token_query, expand=expand)

# Extract order details
order = api_response.order

# Print order details
print(order)
