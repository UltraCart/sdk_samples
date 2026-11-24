"""
Scenario: you run your own Accounts Receivable retry process instead of UltraCart's Accounts Receivable Retry service.
A customer's card was declined (for example on an auto order rebill) and the order is sitting in Accounts Receivable.
Your process decides, order by order, whether to retry the charge, ask the customer to update their billing
information, or give up and reject the order.

Sequence:
1) get_order()                 - confirm the order is still in Accounts Receivable.
2) process_payment()           - retry the charge.  Optionally pick the gateway with rotating_transaction_gateway_code.
3) If the retry is declined, either:
   a) send_update_billing_email()   - email the customer a link to update their card, or
   b) cancel_order_with_options()   - give up and reject the order, with a reject reason.

Questions this sample answers:
- Is an API retry of an auto order rebill sent to the gateway as a recurring transaction?  Yes.  process_payment()
  flags the charge as recurring whenever the order belongs to an auto order, the same as UltraCart's retry service.
- Can I choose the gateway?  Yes, with rotating_transaction_gateway_code on the process payment request.  It must be
  an active rotating transaction gateway on the account.  The charge is attempted on that gateway only, with no
  cascade to your other gateways, the same as choosing a gateway on the Accounts Receivable Process Payment screen.
  If the gateway does not support the card type, UltraCart's normal gateway selection is used; the transaction
  details show which gateway processed the charge.
  Use this for soft declines and gateway outages.  Re-running a hard decline (stolen card, closed account, do not
  honor) on another gateway can violate card network retry rules.
- Does rejecting the order cancel the customer's auto order?  Not for a rebill.  A rejected rebill leaves the auto
  order active, so it rebills on its next cycle.  Rejecting the auto order's original order cancels the auto order.
- Does the customer get an email when the order is rejected?  No.
- How often can I send the update billing email?  Once per order per 24 hours through the API.  While the order is
  less than 7 days old, UltraCart also sends a reminder every 2 days on its own.

Requires SDK 4.1.260 or later.
"""
from samples import api_client
from ultracart.apis import OrderApi
from ultracart.models import OrderProcessPaymentRequest, OrderCancelRequest
from ultracart import ApiException
import logging

# Configure logging
logging.basicConfig(level=logging.ERROR)
logger = logging.getLogger(__name__)

order_id = 'DEMO-0009104436'

# Optional.  The code of an active rotating transaction gateway on your account, or None to let UltraCart choose.
rotating_transaction_gateway_code = None  # change_me: e.g. 'BACKUP_GATEWAY'

# What to do if the retry is declined.  True rejects the order, False asks the customer to update their card.
give_up_if_declined = False
reject_reason = 'Card declined'  # Configured at Home -> Configuration -> Order Management -> Refund/Reject Reasons

try:
    order_api = OrderApi(api_client())

    # Step 1. Make sure the order is still in Accounts Receivable.
    order_response = order_api.get_order(order_id, expand='auto_order')
    if hasattr(order_response, 'error') and order_response.error:
        logger.error(order_response.error.developer_message)
        logger.error(order_response.error.user_message)
        exit()
    order = order_response.order

    if order.current_stage != 'Accounts Receivable':
        print(f"Order is in stage '{order.current_stage}', not Accounts Receivable.  Nothing to do.")
        exit()
    if order.get('auto_order'):
        print(f"Order belongs to auto order {order.auto_order.auto_order_code}.  The retry is sent as a recurring charge.")

    # Step 2. Retry the charge.
    process_payment_request = OrderProcessPaymentRequest()
    if rotating_transaction_gateway_code:
        process_payment_request.rotating_transaction_gateway_code = rotating_transaction_gateway_code

    payment_response = order_api.process_payment(order_id, process_payment_request)
    transaction = payment_response.get('payment_transaction')

    if transaction is None:
        # No charge was attempted.  For example, the gateway code is not an active gateway on the account.
        print(f"Payment was not attempted: {payment_response.error.user_message if payment_response.error else 'unknown reason'}")
        exit()

    gateway_used = next((d.value for d in (transaction.get('details') or []) if d.name == 'rotatingTransactionGatewayCode'), None)
    print(f"Charge attempted through {transaction.get('transaction_gateway')} (rotating gateway {gateway_used})")

    if payment_response.success:
        print('Payment succeeded.  The order has moved out of Accounts Receivable.')
        exit()

    print('Payment was declined.')

    # Step 3. The retry was declined.
    if give_up_if_declined:
        # Step 3b. Reject the order.  The customer is not emailed, and an auto order rebill keeps its auto order.
        cancel_response = order_api.cancel_order_with_options(order_id, OrderCancelRequest(reject_reason=reject_reason))
        if cancel_response.success:
            print('Order was rejected.')
        else:
            print(f"Order could not be rejected: {cancel_response.error.user_message if cancel_response.error else 'unknown reason'}")
    else:
        # Step 3a. Ask the customer to update their billing information.  Raises an ApiException (HTTP 400) with
        # the reason if UltraCart will not send it, for example if it was already sent through the API in the last 24 hours.
        email_response = order_api.send_update_billing_email(order_id)
        if email_response.success:
            print('Update billing email was queued.')

except ApiException as e:
    logger.error(f"API Exception: {e}")
    print('The order could not be processed due to an API error.')
