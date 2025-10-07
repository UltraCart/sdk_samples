import logging
from ultracart import ApiException
from ultracart.apis import OrderApi
from samples import api_client

# Enable error logging
logging.basicConfig(level=logging.DEBUG)

# isRefundable queries the UltraCart system whether an order is refundable or not.
# In addition to a simple boolean response, UltraCart also returns back any reasons why
# an order is not refundable.
# Finally, the response also contains any refund or return reasons configured on the account
# in the event that this merchant account is configured to require a reason for a return or refund.

# Using the API key to initialize the order API
order_api = OrderApi(api_client())

order_id = 'DEMO-0009104976'

try:
    api_response = order_api.is_refundable_order(order_id)
except ApiException as e:
    logging.error(f"Exception when calling OrderApi->is_refundable_order: {e}")
    exit()

# This could get verbose...
# import pprint
# pprint.pprint(api_response)
