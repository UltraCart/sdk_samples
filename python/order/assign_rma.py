"""
OrderApi.assign_rma() associates an RMA (return merchandise authorization) number with an order.

The rma value is required, may be at most 30 characters, and is trimmed by the server.
Any existing RMA on the order is replaced, and a merchant note is added to the order recording the change.
The optional expand parameter controls how much of the order is returned in the response.

Requires the order_write scope.
"""
from ultracart.model.order_assign_rma_request import OrderAssignRmaRequest

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

    order_id = 'DEMO-0009104390'
    expand = 'item,summary'

    req = OrderAssignRmaRequest()
    req['rma'] = 'RMA-12345'

    api_response = order_api.assign_rma(order_id, req, expand=expand)

    # Check for errors
    if hasattr(api_response, 'error') and api_response.error:
        logger.error(api_response.error.developer_message)
        logger.error(api_response.error.user_message)
        print('RMA could not be assigned. See Python error log.')
        exit()

    order = api_response.order
    print(f"RMA {order.rma} was assigned to order {order.order_id}.")

except ApiException as e:
    logger.error(f"API Exception: {e}")
    print('RMA could not be assigned due to an API error.')
