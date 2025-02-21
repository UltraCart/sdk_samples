from ultracart.apis import OrderApi
from samples import api_client

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

expand = "item,summary,billing,shipping,shipping.tracking_number_details"

# Define order ID
order_id = 'DEMO-0009104390'

# Retrieve order
api_response = order_api.get_order(order_id, expand=expand)

# Check for errors
if api_response.error:
    print(f"Developer Message: {api_response.error.developer_message}")
    print(f"User Message: {api_response.error.user_message}")
    exit()

# Extract order details
order = api_response.order

# Print order details
print(order)
