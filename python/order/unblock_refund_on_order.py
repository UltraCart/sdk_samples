import logging
from ultracart import ApiException
from ultracart.apis import OrderApi
from samples import api_client

# Enable error logging
logging.basicConfig(level=logging.DEBUG)

##
## unblockRefundOnOrder removes an order property that is considered when a refund request is made.
## If the property is present, the refund is denied.  Being an order property allows for querying
## upon it within BigQuery for audit purposes.

# Using the API key to initialize the order API
order_api = OrderApi(api_client())

order_id = 'DEMO-0009105222'

try:
    order_api.unblock_refund_on_order(order_id )
except ApiException as e:
    logging.error(f"Exception when calling OrderApi->unblock_refund_on_order: {e}")
    exit()

print('Method executed successfully. Returns back 204 No Content')