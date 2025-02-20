from ultracart.apis import AutoOrderApi
from samples import api_client

"""
This script demonstrates updating an auto order.
Warning: Take great care editing auto orders. They are complex.
Sometimes you must change the original_order to affect the auto_order. If you have questions about what fields
to update to achieve your desired change, contact UltraCart support. Better to ask and get it right than to
make a bad assumption and corrupt a thousand auto orders. UltraCart support is ready to assist.
"""

# Initialize the API client
auto_order_api = AutoOrderApi(api_client())

# See https://www.ultracart.com/api/#resource_auto_order.html for complete list
expand = "items,items.future_schedules,original_order,rebill_orders"

# Get an auto order and update it. There are many ways to retrieve an auto order.
auto_order_oid = 123456789

# Retrieve the auto order
api_response = auto_order_api.get_auto_order(auto_order_oid)
auto_order = api_response.auto_order
validate_original_order = 'No'

# For this example, the customer supplied the wrong postal code when ordering.
# So to change the postal code for all subsequent auto orders, we change the original order.
auto_order.original_order.billing.postal_code = '44233'

# Update the auto order
api_response = auto_order_api.update_auto_order(auto_order_oid, auto_order,
                                                validate_original_order=validate_original_order, expand=expand)
updated_auto_order = api_response.auto_order
print(updated_auto_order)
