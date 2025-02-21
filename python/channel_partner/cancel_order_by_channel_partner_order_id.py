"""
cancelOrderByChannelPartnerOrderId takes a channel partner order id, which is the external order id, and attempts
to 'cancel' the order. UltraCart doesn't have a cancel order state, so this needs some explanation of what happens.

Here is the logic of the cancel process:
If the Order stage is [this] then do [that]:
    'Completed Order'       -> Error: "Order has already been completed."
    'Rejected'             -> Error: "Order has already been rejected."
    'Accounts Receivable'  -> Success: order is rejected.
    'Preordered'          -> Success: order is rejected.
    'Quote Sent'          -> Success: order is rejected.
    'Quote Requested'     -> Success: order is rejected.

The remaining stages are Fraud Review and Shipping Department. Orders in these stages have already completed payment.
From this point, complex logic determines if the order has already shipped, or is queued to ship in a way that cannot be canceled.
Here is the logic for those stages, but the gist of it all is this: If you receive any of the errors below, the order has progressed past a point where it can be canceled.

SHIPPING LOGIC:
Iterate through each item and consider it's shipping status:
    Item has already been transmitted to fulfillment center (contains a transmitted dts) -> Error: "The order has already had an item that has been transmitted to the distribution center."
    Does item DC (distribution center) have a transmission mechanism configured?
        YES -> Does the transmission have schedules? If NO -> Error: "The distribution center does not have any schedules so it would be an immediate transmission."
        NO -> Error: "Cant tell if we can cancel because the DC doesnt have a transport configured."

If the above logic completes without errors, the following conditions must be met:
Order has DC activity records. If NO -> Error: "There is no activity in the DC queue when there should be."
There must be at least 5 minutes before the next DC transmission. If NO -> Error: "Activity record is not at least 5 minutes away so we need to bail."

At this point, the order will be canceled with the following activity:
1) Distribution Center activity is cleared
2) The order is refunded. If the order is less than 24 hours old, a void is attempted instead.

Other Possible Errors:
System errors -> "Internal error. Please contact UltraCart Support."
Order does not exist -> "Invalid order ID specified."
During refunding, original transaction could not be found -> "Unable to find original transaction on the order."
During refunding, original transaction was found, but transaction id could not be found -> "Unable to locate original transaction reference number."
During refunding, PayPal was used by no longer configured -> "PayPal is no longer configured on your account to refund against."
Gateway does not support refunds -> [GatewayName] does not support refunds at this time.
"""

from ultracart.apis import ChannelPartnerApi
from ultracart.exceptions import ApiException
from samples import channel_partner_api_client

channel_partner_api = ChannelPartnerApi(channel_partner_api_client())

channel_partner_order_id = 'BLAH-BLAH-123'

try:
    cancel_result = channel_partner_api.cancel_order_by_channel_partner_order_id(channel_partner_order_id)
    if not cancel_result.success:
        for error in cancel_result.cancel_errors:
            print(error)

except ApiException as e:
    print(e)  # Prints the exception information