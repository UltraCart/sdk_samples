require 'ultracart_api'
require_relative '../constants'

# Scenario: you run your own Accounts Receivable retry process instead of UltraCart's Accounts Receivable Retry service.
# A customer's card was declined (for example on an auto order rebill) and the order is sitting in Accounts Receivable.
# Your process decides, order by order, whether to retry the charge, ask the customer to update their billing
# information, or give up and reject the order.
#
# Sequence:
# 1) get_order()                 - confirm the order is still in Accounts Receivable.
# 2) process_payment()           - retry the charge.  Optionally pick the gateway with rotating_transaction_gateway_code.
# 3) If the retry is declined, either:
#    a) send_update_billing_email()   - email the customer a link to update their card, or
#    b) cancel_order_with_options()   - give up and reject the order, with a reject reason.
#
# Questions this sample answers:
# - Is an API retry of an auto order rebill sent to the gateway as a recurring transaction?  Yes.  process_payment()
#   flags the charge as recurring whenever the order belongs to an auto order, the same as UltraCart's retry service.
# - Can I choose the gateway?  Yes, with rotating_transaction_gateway_code on the process payment request.  It must be
#   an active rotating transaction gateway on the account.  The charge is attempted on that gateway only, with no
#   cascade to your other gateways, the same as choosing a gateway on the Accounts Receivable Process Payment screen.
#   If the gateway does not support the card type, UltraCart's normal gateway selection is used; the transaction
#   details show which gateway processed the charge.
#   Use this for soft declines and gateway outages.  Re-running a hard decline (stolen card, closed account, do not
#   honor) on another gateway can violate card network retry rules.
# - Does rejecting the order cancel the customer's auto order?  Not for a rebill.  A rejected rebill leaves the auto
#   order active, so it rebills on its next cycle.  Rejecting the auto order's original order cancels the auto order.
# - Does the customer get an email when the order is rejected?  No.
# - How often can I send the update billing email?  Once per order per 24 hours through the API.  While the order is
#   less than 7 days old, UltraCart also sends a reminder every 2 days on its own.
#
# Requires SDK 4.1.260 or later.

order_api = UltracartClient::OrderApi.new_using_api_key(Constants::API_KEY)

order_id = 'DEMO-0009104436'

# Optional.  The code of an active rotating transaction gateway on your account, or nil to let UltraCart choose.
rotating_transaction_gateway_code = nil # change_me: e.g. 'BACKUP_GATEWAY'

# What to do if the retry is declined.  true rejects the order, false asks the customer to update their card.
give_up_if_declined = false
reject_reason = 'Card declined' # Configured at Home -> Configuration -> Order Management -> Refund/Reject Reasons

begin
  # Step 1. Make sure the order is still in Accounts Receivable.
  order_response = order_api.get_order(order_id, { _expand: 'auto_order' })
  if order_response.error
    puts "Developer Message: #{order_response.error.developer_message}"
    puts "User Message: #{order_response.error.user_message}"
    exit
  end
  order = order_response.order

  if order.current_stage != 'Accounts Receivable'
    puts "Order is in stage '#{order.current_stage}', not Accounts Receivable.  Nothing to do."
    exit
  end
  if order.auto_order
    puts "Order belongs to auto order #{order.auto_order.auto_order_code}.  The retry is sent as a recurring charge."
  end

  # Step 2. Retry the charge.
  process_payment_request = UltracartClient::OrderProcessPaymentRequest.new
  process_payment_request.rotating_transaction_gateway_code = rotating_transaction_gateway_code if rotating_transaction_gateway_code

  payment_response = order_api.process_payment(order_id, process_payment_request)
  transaction = payment_response.payment_transaction

  if transaction.nil?
    # No charge was attempted.  For example, the gateway code is not an active gateway on the account.
    puts "Payment was not attempted: #{payment_response.error&.user_message}"
    exit
  end

  gateway_used = (transaction.details || []).find { |d| d.name == 'rotatingTransactionGatewayCode' }&.value
  puts "Charge attempted through #{transaction.transaction_gateway} (rotating gateway #{gateway_used})"

  if payment_response.success
    puts 'Payment succeeded.  The order has moved out of Accounts Receivable.'
    exit
  end

  puts 'Payment was declined.'

  # Step 3. The retry was declined.
  if give_up_if_declined
    # Step 3b. Reject the order.  The customer is not emailed, and an auto order rebill keeps its auto order.
    cancel_request = UltracartClient::OrderCancelRequest.new(reject_reason: reject_reason)
    cancel_response = order_api.cancel_order_with_options(order_id, cancel_request)
    if cancel_response.success
      puts 'Order was rejected.'
    else
      puts "Order could not be rejected: #{cancel_response.error&.user_message}"
    end
  else
    # Step 3a. Ask the customer to update their billing information.  Raises an UltracartClient::ApiError (HTTP 400)
    # with the reason if UltraCart will not send it, for example if it was already sent through the API in the last 24 hours.
    email_response = order_api.send_update_billing_email(order_id)
    puts 'Update billing email was queued.' if email_response.success
  end
rescue UltracartClient::ApiError => e
  puts "The order could not be processed due to an API error: #{e.response_body}"
end
