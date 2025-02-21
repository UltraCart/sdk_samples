import logging
from ultracart import ApiException
from ultracart.apis import OrderApi
from ultracart.models import OrderItem, Currency, Weight, OrderProcessPaymentRequest
from samples import api_client

# Enable error logging
logging.basicConfig(level=logging.DEBUG)

# OrderApi.processPayment() was designed to charge a customer for an order. It was created to work in tandem with
# duplicateOrder(), which does not accomplish payment on its own. The use-case for this method is to
# duplicate a customer's order and then charge them for it. duplicateOrder() does not charge the customer again,
# which is why processPayment() exists.
#
# These are the steps for cloning an existing order and charging the customer for it.
# 1. duplicateOrder
# 2. updateOrder (if you wish to change any part of it)
# 3. processPayment to charge the customer.
#
# As a reminder, if you wish to create a new order from scratch, use the CheckoutApi or ChannelPartnerApi.
# The OrderApi is for managing existing orders.

# Using the API key to initialize the order API
order_api = OrderApi(api_client())

expand = "items"   # For this example, we're going to change the items after we duplicate the order, so
# the only expansion properties we need are the items.
# See: https://www.ultracart.com/api/ for a list of all expansions.

# Step 1. Duplicate the order
order_id_to_duplicate = 'DEMO-0009104436'
try:
    api_response = order_api.duplicate_order(order_id_to_duplicate, expand=expand)
except ApiException as e:
    logging.error(f"Exception when calling OrderApi->duplicate_order: {e}")
    exit()

new_order = api_response.order

# Step 2. Update the items. I will create a new items array and assign it to the order to remove the old ones completely.
items = []
item = OrderItem()
item.merchant_item_id = 'simple_teapot'
item.quantity = 1
item.description = "A lovely teapot"
item.distribution_center_code = 'DFLT'  # Where is this item shipping out of?

cost = Currency()
cost.currency_code = 'USD'
cost.value = 9.99
item.cost = cost

weight = Weight()
weight.uom = "OZ"
weight.value = 6
item.weight = weight

items.append(item)
new_order.items = items

try:
    update_response = order_api.update_order(new_order.order_id, new_order, expand=expand)
except ApiException as e:
    logging.error(f"Exception when calling OrderApi->update_order: {e}")
    exit()

updated_order = update_response.order

# Step 3. Process the payment.
# The request object below takes two optional arguments.
# The first is an amount if you wish to bill for an amount different from the order.
# We do not bill differently in this example.
# The second is card_verification_number_token, which is a token you can create by using our hosted fields to
# upload a CVV value. This will create a token you may use here. However, most merchants using the duplicate
# order method will be setting up an auto order for a customer. Those will not make use of the CVV, so we're
# not including it here. That is why the request object below is does not have any values set.

process_payment_request = OrderProcessPaymentRequest()
try:
    payment_response = order_api.process_payment(new_order.order_id, process_payment_request)
except ApiException as e:
    logging.error(f"Exception when calling OrderApi->process_payment: {e}")
    exit()

transaction_details = payment_response.payment_transaction  # Do whatever you wish with this.

# This could get verbose...
import pprint
print("New Order (after updated items):")
pprint.pprint(updated_order)
print("\nPayment Response:")
pprint.pprint(payment_response)
