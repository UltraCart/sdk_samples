"""
OrderApi.adjustOrderTotal() takes a desired order total and performs goal-seeking to adjust all items and taxes
appropriately.  This method was created for merchants dealing with Medicare and Medicaid.  When selling their
medical devices, they would often run into limits approved by Medicare.  As such, they needed to adjust the
order total to match the approved amount.  This is a convenience method to adjust individual items and their
taxes to match the desired total.
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

    # Set order details
    order_id = 'DEMO-0009104390'
    desired_total = '21.99'

    # Adjust order total
    api_response = order_api.adjust_order_total(order_id, desired_total)

    # Check for errors
    if api_response.error:
        logger.error(api_response.error.developer_message)
        logger.error(api_response.error.user_message)
        print('Order could not be adjusted. See Python error log.')
        exit()

    # Check success
    if api_response.success:
        print('Order was adjusted successfully. Use get_order() to retrieve the order if needed.')

except ApiException as e:
    logger.error(f"API Exception: {e}")
    print('Order could not be adjusted due to an API error.')