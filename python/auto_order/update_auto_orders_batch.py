from ultracart.apis import AutoOrderApi
from ultracart.models import AutoOrdersRequest
from samples import api_client

"""
This script demonstrates updating multiple auto orders in a batch.
Warning: Take great care editing auto orders. They are complex.
Sometimes you must change the original_order to affect the auto_order. If you have questions about what fields
to update to achieve your desired change, contact UltraCart support. Better to ask and get it right than to
make a bad assumption and corrupt a thousand auto orders. UltraCart support is ready to assist.
"""

# Initialize the API client
auto_order_api = AutoOrderApi(api_client())

# The async parameter is what it seems. True if async.
# The max records allowed depends on the async flag. Sync max is 20, Async max is 100.
async_flag = True  # if true, success returns back a 204 No Content. False returns back the updated orders.

# Since we're async, nothing is returned, so we don't care about expansions.
# If you are doing a synchronous operation, then set your expand appropriately.
# See getAutoOrders() sample for expansion samples.
expand = None

# Mostly used for UI, not needed for a pure scripting operation
placeholders = False

# TODO: This should be an array of auto orders that have been updated.
# See any getAutoOrders method for retrieval.
auto_orders = []

# Create the request object and set the auto orders
auto_orders_request = AutoOrdersRequest()
auto_orders_request.auto_orders = auto_orders

# Perform the batch update
api_response = auto_order_api.update_auto_orders_batch(auto_orders_request, expand=expand, placeholders=placeholders,
                                                       async_flag=async_flag)

if api_response is not None:
    # Something went wrong if we have a response
    print(api_response)
