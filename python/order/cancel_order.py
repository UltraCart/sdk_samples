"""
OrderApi.cancelOrder() cancels an order by rejecting it.

Restrictions:
1) Cannot cancel completed orders
2) Cannot cancel already rejected orders
3) Cannot cancel orders transmitted to fulfillment center
4) Cannot cancel orders queued for distribution center transmission
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

    # Set order to cancel
    order_id = 'DEMO-0009104390'

    # Cancel order
    api_response = order_api.cancel_order(order_id)

    # Check for errors
    if api_response.error:
        logger.error(api_response.error.developer_message)
        logger.error(api_response.error.user_message)
        print('Order could not be canceled. See Python error log.')
        exit()

    # Check success
    if api_response.success:
        print('Order was canceled successfully.')

except ApiException as e:
    logger.error(f"API Exception: {e}")
    print('Order could not be canceled due to an API error.  An exception will occur if you attempt to cancel an order that has immediate transmission configured for the distribution center.  Those orders cannot be canceled because they were immedatiately sent to a fulfillment center.')