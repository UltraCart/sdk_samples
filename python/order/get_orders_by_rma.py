"""
OrderApi.get_orders_by_rma() retrieves the orders associated with an RMA number.

The RMA must be an exact value; wildcards such as * are not permitted and will return a 400 error.
More than one order can share the same RMA, so the response contains a list of orders.
This lookup is backed by a search index, so an RMA that was just assigned may take a short time to appear.

Requires the order_read scope.
"""
from samples import api_client
from ultracart.apis import OrderApi
from ultracart import ApiException
import logging

# Configure logging
logging.basicConfig(level=logging.ERROR)
logger = logging.getLogger(__name__)

try:
    # Initialize Order API
    order_api = OrderApi(api_client())

    # See www.ultracart.com/api/ for all the expansion fields available.
    expand = 'item,summary,billing,shipping'

    rma = 'RMA-12345'

    api_response = order_api.get_orders_by_rma(rma, expand=expand)

    # Check for errors
    if hasattr(api_response, 'error') and api_response.error:
        logger.error(api_response.error.developer_message)
        logger.error(api_response.error.user_message)
        print('Orders could not be retrieved. See Python error log.')
        exit()

    orders = api_response.orders
    print(f"Found {len(orders)} order(s) with RMA {rma}.")
    for order in orders:
        print(order.order_id)

except ApiException as e:
    logger.error(f"API Exception: {e}")
    print('Orders could not be retrieved due to an API error.')
