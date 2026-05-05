"""
OrderApi.assignToAffiliate() will assign an affiliate and (optionally) affiliate sub_id to an order.
You may do this manually in the backend here:
At https://secure.ultracart.com/merchant/orderprocessing/util/reviewOrdersLoad.do
click on a single order, then from the left menu, choose Tools -> Assign to Affiliate

This will only work if you have affiliates turned on for your merchant account.  Affiliates are not
active by default because they require setup and configuration.
"""
from ultracart.model.order_assign_to_affiliate_request import OrderAssignToAffiliateRequest

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

    order_id = 'DEMO-0009105981'
    expand = 'affiliate'

    req = OrderAssignToAffiliateRequest()
    req['affiliate_id'] = 94822
    req['affiliate_sub_id'] = 'bobby'

    api_response = order_api.assign_to_affiliate(order_id, req, expand=expand)
    print(api_response)

    # Check for errors
    if hasattr(api_response, 'error') and api_response.error:
        logger.error(api_response.error.developer_message)
        logger.error(api_response.error.user_message)
        print('Assignment could not be made. See Python error log.')
        exit()

    # Check success
    if api_response.success:
        print('Order was assigned successfully.')


except ApiException as e:
    logger.error(f"API Exception: {e}")
    print('Order could not be assigned due to an API error.')
