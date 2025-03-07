# This is a convenience method created for an UltraCart merchant to pause a large number of auto orders
# due to an inventory shortage.  This is not new functionality and can be accomplished with the normal updateAutoOrder
# call.  It does the following logic to an auto order:
# for each item in the auto order:
#    if the item is not paused, pause it, setPause(true)
# save the changes by calling updateAutoOrder()
#
# Some warnings if you choose to use this method.
# There are no convenience methods to unpause auto orders.
# There are no convenience methods to query which auto orders are paused.
# We do not recommend pausing auto orders and the merchant is on their own to manage auto order state if they
# choose to begin pausing orders.  Keep good track of what you're doing.

from ultracart.apis import AutoOrderApi
from samples import api_client

auto_order_api = AutoOrderApi(api_client())

expand = "items"  # see https://www.ultracart.com/api/#resource_auto_order.html for list
auto_order_oid = 123456789  # get an auto order and update it.  There are many ways to retrieve an auto order.
get_response = auto_order_api.get_auto_order(auto_order_oid, expand=expand)
auto_order = get_response.auto_order

pause_response = auto_order_api.pause_auto_order(auto_order_oid, auto_order)
paused_auto_order = pause_response.auto_order
print(paused_auto_order)