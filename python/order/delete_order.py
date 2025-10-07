"""
OrderApi.deleteOrder() deletes an order. While rejecting orders is often preferred for audit trails,
deleting test orders can help maintain a tidy order history.
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

    # Set order to delete
    order_id = 'DEMO-0009105482'

    # Delete order
    order_api.delete_order(order_id)
    print('Order was deleted successfully.')

except ApiException as e:
    logger.error(f"API Exception: {e}")
    print('Order could not be deleted.')