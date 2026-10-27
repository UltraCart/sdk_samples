"""
Scenario: an order is paid and sitting in the Shipping Department.  The warehouse has not printed a label yet,
and the customer asks to cancel the order and get a full refund.

The UltraCart part is a single call: refund_order() with reject_after_refund=True.  This is the API version of the
"Complete Refund (then reject)" button in the backend.  It refunds the order to the original payment method and
moves the order out of the Shipping Department into Rejected.  No separate cancel call is needed.

Sequence:
1) get_order()           - confirm the order is in the Shipping Department and has no tracking numbers.
2) is_refundable_order() - confirm UltraCart will allow the refund.
3) Cancel the order at your fulfillment provider.
   - Using ShipStation with "Cancel in ShipStation on Full Refund" set to Yes on the distribution center's
     transport mechanism?  Skip this step.  After the full refund in step 4, UltraCart automatically tells
     ShipStation to cancel the order.  Test this end to end on a test order before relying on it.  If ShipStation
     refuses (a label already exists), the refund has already happened.  UltraCart records the refusal as a
     warning in the distribution center log.
   - Otherwise, cancel the order at your fulfillment provider FIRST.  If it refuses because a label already
     exists, stop and do not refund.  This sample does not make that call.
4) refund_order()        - full refund, then reject.

Questions this sample answers:
- Will UltraCart re-send the order to the fulfillment center afterwards?  No.  An order is only retransmitted if
  someone moves it back into the Shipping Department with retransmit checked, or clicks Retransmit.
- Why not cancel_order()?  cancel_order() fails once an order is queued for or transmitted to a fulfillment center,
  which is the case for an order waiting in the Shipping Department.
- What about orders created by an auto order?  Pass auto_order_cancel=False and the auto order is left alone.
  Cancel the auto order separately if that is what the customer wants.
"""
from samples import api_client
from ultracart.apis import OrderApi
from ultracart import ApiException
import logging

# Configure logging
logging.basicConfig(level=logging.ERROR)
logger = logging.getLogger(__name__)

order_id = 'DEMO-0009104436'

# See: https://www.ultracart.com/api/ for a list of all expansions.
expand = 'item,shipping,summary,auto_order'

try:
    order_api = OrderApi(api_client())

    # Step 1. Retrieve the order and make sure it has not shipped.
    order_response = order_api.get_order(order_id, expand=expand)
    if hasattr(order_response, 'error') and order_response.error:
        logger.error(order_response.error.developer_message)
        logger.error(order_response.error.user_message)
        exit()
    order = order_response.order

    if order.current_stage != 'Shipping Department':
        print(f"Order is in stage '{order.current_stage}', not the Shipping Department.  Not refunding.")
        exit()
    tracking_numbers = order.shipping.get('tracking_numbers') if order.get('shipping') else None
    if tracking_numbers:
        print(f"Order already has tracking numbers {tracking_numbers}.  Too late to cancel.")
        exit()
    if order.get('auto_order'):
        print(f"Order belongs to auto order {order.auto_order.auto_order_code}.  The auto order will not be cancelled.")

    # Step 2. Ask UltraCart whether the order can be refunded.
    refundable_response = order_api.is_refundable_order(order_id)
    if not refundable_response.get('refundable'):  # None should be treated as False
        print('Order is not refundable:')
        print(refundable_response)
        exit()

    # Step 3. Unless ShipStation cancels the order for you (see the comment above), cancel it at your fulfillment provider here, before refunding.

    # Step 4. Mark everything as refunded.  These are TOTAL amounts (positive numbers), not deltas.
    # Warning: if this is a 2nd refund after an earlier partial refund, account for what was already refunded.
    # A refund reason may be required by your account.  It is configured at
    # Home -> Configuration -> Order Management -> Refund/Reject Reasons
    # order.refund_reason = 'CustomerCancel'
    order.summary.tax_refunded = order.summary.tax
    order.summary.shipping_handling_refunded = order.summary.shipping_handling_total
    for item in order.items:
        item.quantity_refunded = item.quantity
        item.total_refunded = item.total_cost_with_discount

    refund_response = order_api.refund_order(
        order_id,
        order,
        reject_after_refund=True,             # moves the order out of the Shipping Department into Rejected
        skip_customer_notification=False,     # let the customer know their refund is on the way
        auto_order_cancel=False,              # leave the auto order (if any) alone
        manual_refund=False,                  # refund through the payment gateway, to the original payment method
        reverse_affiliate_transactions=True,  # no affiliate commission on a cancelled order
        issue_store_credit=False,             # money back, not store credit
        expand='item,summary'
    )

    # "Request to refund an invalid amount." means the refund total came out as zero or less.
    if hasattr(refund_response, 'error') and refund_response.error:
        logger.error(refund_response.error.developer_message)
        logger.error(refund_response.error.user_message)
        print('Order could not be refunded. See Python error log.')
        exit()

    refunded_order = refund_response.order
    print(f"Current Stage: {refunded_order.current_stage}")  # should be Rejected
    print(f"Total Refunded: {refunded_order.summary.total_refunded.value}")

except ApiException as e:
    logger.error(f"API Exception: {e}")
    print('Order could not be refunded due to an API error.')
