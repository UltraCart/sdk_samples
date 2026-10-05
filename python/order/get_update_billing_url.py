"""
OrderApi.get_update_billing_url() generates the url a customer can use to update the billing
information on the auto order associated with an order.  This is the same url sent in the
auto order update billing email.

The order must belong to an auto order or a 400 error is returned.  Either the original order
or any rebill order of the auto order may be used.

Requires the order_write scope because the url carries a customer access token.
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

    order_id = 'DEMO-0009104390'

    api_response = order_api.get_update_billing_url(order_id)

    # Check for errors
    if hasattr(api_response, 'error') and api_response.error:
        logger.error(api_response.error.developer_message)
        logger.error(api_response.error.user_message)
        print('Update billing url could not be generated. See Python error log.')
        exit()

    # WARNING: this url grants access to the customer's billing information.
    # In production, do not log it or expose it publicly; only deliver it to the customer.
    if api_response.success:
        print(api_response.update_billing_url)

except ApiException as e:
    logger.error(f"API Exception: {e}")
    print('Update billing url could not be generated due to an API error.')
