import logging
from ultracart import ApiException
from ultracart.apis import OrderApi
from ultracart.models import OrderItem
from samples import api_client

# Enable error logging
logging.basicConfig(level=logging.DEBUG)

# refundOrder() allows for both partial and complete refunds. Both are accomplished with the same steps.
# 1) Retrieve an order object using the SDK.
# 2) Input the refunded quantities for any or all items.
# 3) Call refundOrder, passing in the modified object.
# 4) To do a full refund, set all item refund quantities to their purchased quantities.
#
# This example will perform a full refund.

# Using the API key to initialize the order API
order_api = OrderApi(api_client())

# For the refund, we only need the items expanded to adjust their quantities.
# See: https://www.ultracart.com/api/ for a list of all expansions.
expand = "item"

# Step 1. Retrieve the order
order_id = 'DEMO-0009106282'
try:
    api_response = order_api.get_order(order_id, expand=expand)
except ApiException as e:
    logging.error(f"Exception when calling OrderApi->get_order: {e}")
    exit()

order = api_response.order

# Step 2. Adjust the refunded quantities
for item in order.items:
    item.quantity_refunded = item.quantity

# Step 3. Refund the order with the modified items
reject_after_refund = False
skip_customer_notification = True
cancel_associated_auto_orders = True  # Does not matter for this sample. The order is not a recurring order.
consider_manual_refund_done_externally = True  # Usually this is false for Credit Card orders.  This example is a cash order.
reverse_affiliate_transactions = True  # Can't let my affiliates get money on a refunded order. Bad business.

try:
    order.refund_reason = "CustomerCancel"
    refund_response = order_api.refund_order(order_id,
                                             order,
                                             reject_after_refund=reject_after_refund,
                                             skip_customer_notification=skip_customer_notification,
                                             auto_order_cancel=cancel_associated_auto_orders,
                                             manual_refund=consider_manual_refund_done_externally,
                                             reverse_affiliate_transactions=reverse_affiliate_transactions,
                                             # auto_order_cancel_reason='Customer Dissatisfied',
                                             expand=expand)
except ApiException as e:
    logging.error(f"Exception when calling OrderApi->refund_order: {e}")
    exit()

refunded_order = refund_response.order

# Examining the refunded order and ensuring everything was refunded correctly
import pprint
print("Refunded Order:")
pprint.pprint(refunded_order)
