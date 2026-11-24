"""
OrderApi.cancel_order_with_options() cancels an order, the same as cancel_order(), with the options in a request body.
An empty OrderCancelRequest behaves exactly like cancel_order().

Options:
- reject_reason:          stored on the order when it is rejected without a refund (Accounts Receivable, Pre-order,
                          Quote or Hold), the same as the reject reason in the backend.  Reasons are configured at
                          Home -> Configuration -> Order Management -> Refund/Reject Reasons
- lock_self_ship_orders:  prevent the order from shipping during the refund process
- skip_refund_and_hold:   skip the refund and move the order to the Held Orders department

Rejecting an order in Accounts Receivable:
- The customer is not emailed.
- A rejected auto order rebill leaves the auto order active, so it rebills on its next cycle.
- Rejecting the auto order's original order cancels the auto order, because the first payment never succeeded.

Restrictions (the same as cancel_order()):
1) Cannot cancel completed orders
2) Cannot cancel already rejected orders
3) Cannot cancel orders transmitted to fulfillment center
4) Cannot cancel orders queued for distribution center transmission

Requires SDK 4.1.260 or later.
"""

from samples import api_client
from ultracart.apis import OrderApi
from ultracart.models import OrderCancelRequest
from ultracart import ApiException
import logging

# Configure logging
logging.basicConfig(level=logging.ERROR)
logger = logging.getLogger(__name__)

try:
    order_api = OrderApi(api_client())

    order_id = 'DEMO-0009104436'

    cancel_request = OrderCancelRequest(reject_reason='Card declined')

    api_response = order_api.cancel_order_with_options(order_id, cancel_request)

    if api_response.error:
        logger.error(api_response.error.developer_message)
        logger.error(api_response.error.user_message)
        print('Order could not be canceled. See Python error log.')
        exit()

    if api_response.success:
        print('Order was canceled successfully.')

except ApiException as e:
    logger.error(f"API Exception: {e}")
    print('Order could not be canceled due to an API error.')
