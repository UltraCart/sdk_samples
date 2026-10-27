require 'ultracart_api'
require_relative '../constants'

# Scenario: an order is paid and sitting in the Shipping Department.  The warehouse has not printed a label yet,
# and the customer asks to cancel the order and get a full refund.
#
# The UltraCart part is a single call: refund_order() with reject_after_refund=true.  This is the API version of the
# "Complete Refund (then reject)" button in the backend.  It refunds the order to the original payment method and
# moves the order out of the Shipping Department into Rejected.  No separate cancel call is needed.
#
# Sequence:
# 1) get_order()           - confirm the order is in the Shipping Department and has no tracking numbers.
# 2) is_refundable_order() - confirm UltraCart will allow the refund.
# 3) Cancel the order at your fulfillment provider.
#    - Using ShipStation with "Cancel in ShipStation on Full Refund" set to Yes on the distribution center's
#      transport mechanism?  Skip this step.  After the full refund in step 4, UltraCart automatically tells
#      ShipStation to cancel the order.  Test this end to end on a test order before relying on it.  If ShipStation
#      refuses (a label already exists), the refund has already happened.  UltraCart records the refusal as a
#      warning in the distribution center log.
#    - Otherwise, cancel the order at your fulfillment provider FIRST.  If it refuses because a label already
#      exists, stop and do not refund.  This sample does not make that call.
# 4) refund_order()        - full refund, then reject.
#
# Questions this sample answers:
# - Will UltraCart re-send the order to the fulfillment center afterwards?  No.  An order is only retransmitted if
#   someone moves it back into the Shipping Department with retransmit checked, or clicks Retransmit.
# - Why not cancel_order()?  cancel_order() fails once an order is queued for or transmitted to a fulfillment center,
#   which is the case for an order waiting in the Shipping Department.
# - What about orders created by an auto order?  Pass auto_order_cancel: false and the auto order is left alone.
#   Cancel the auto order separately if that is what the customer wants.

order_api = UltracartClient::OrderApi.new_using_api_key(Constants::API_KEY)

order_id = 'DEMO-0009104436'

# See: https://www.ultracart.com/api/ for a list of all expansions.
expand = 'item,shipping,summary,auto_order'

begin
  # Step 1. Retrieve the order and make sure it has not shipped.
  order_response = order_api.get_order(order_id, { _expand: expand })
  if order_response.error
    puts "Developer Message: #{order_response.error.developer_message}"
    puts "User Message: #{order_response.error.user_message}"
    exit
  end
  order = order_response.order

  if order.current_stage != 'Shipping Department'
    puts "Order is in stage '#{order.current_stage}', not the Shipping Department.  Not refunding."
    exit
  end
  tracking_numbers = order.shipping&.tracking_numbers
  if tracking_numbers && !tracking_numbers.empty?
    puts "Order already has tracking numbers #{tracking_numbers}.  Too late to cancel."
    exit
  end
  if order.auto_order
    puts "Order belongs to auto order #{order.auto_order.auto_order_code}.  The auto order will not be cancelled."
  end

  # Step 2. Ask UltraCart whether the order can be refunded.
  refundable_response = order_api.is_refundable_order(order_id)
  unless refundable_response.refundable # nil should be treated as false
    puts 'Order is not refundable:'
    p refundable_response
    exit
  end

  # Step 3. Unless ShipStation cancels the order for you (see the comment above), cancel it at your fulfillment provider here, before refunding.

  # Step 4. Mark everything as refunded.  These are TOTAL amounts (positive numbers), not deltas.
  # Warning: if this is a 2nd refund after an earlier partial refund, account for what was already refunded.
  # A refund reason may be required by your account.  It is configured at
  # Home -> Configuration -> Order Management -> Refund/Reject Reasons
  # order.refund_reason = 'CustomerCancel'
  order.summary.tax_refunded = order.summary.tax
  order.summary.shipping_handling_refunded = order.summary.shipping_handling_total
  order.items.each do |item|
    item.quantity_refunded = item.quantity
    item.total_refunded = item.total_cost_with_discount
  end

  opts = {
    reject_after_refund: true,             # moves the order out of the Shipping Department into Rejected
    skip_customer_notification: false,     # let the customer know their refund is on the way
    auto_order_cancel: false,              # leave the auto order (if any) alone
    manual_refund: false,                  # refund through the payment gateway, to the original payment method
    reverse_affiliate_transactions: true,  # no affiliate commission on a cancelled order
    issue_store_credit: false,             # money back, not store credit
    _expand: 'item,summary'
  }
  refund_response = order_api.refund_order(order_id, order, opts)

  # "Request to refund an invalid amount." means the refund total came out as zero or less.
  if refund_response.error
    puts "Developer Message: #{refund_response.error.developer_message}"
    puts "User Message: #{refund_response.error.user_message}"
    exit
  end

  refunded_order = refund_response.order
  puts "Current Stage: #{refunded_order.current_stage}" # should be Rejected
  puts "Total Refunded: #{refunded_order.summary.total_refunded.value}"
rescue StandardError => e
  puts "An error occurred: #{e.message}"
end
