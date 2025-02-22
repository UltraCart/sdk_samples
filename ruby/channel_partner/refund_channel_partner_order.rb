# IMPORTANT: Do NOT construct the refunded order. This method does a refund but also update the entire object, so start with an order query.
# ALWAYS start with an order retrieved from the system.
# 1. Call getChannelPartnerOrder or getChannelPartnerOrderByChannelPartnerOrderId to retrieve the order being refunded
# 2. For a full refund, reverse the following:
#    A. Set the refunded qty and refunded amount for each item.
#    B. Set the refunded tax (if any)
#    C. Set the refunded shipping
# NOTE: refund amounts are positive numbers. If any item total cost is $20.00, a full refunded amount would also be positive $20.00
# See the ChannelPartnerApi.getChannelPartnerOrder() sample for details on that method.

require 'ultracart_api'
require_relative '../constants'

channel_partner_api = UltracartClient::ChannelPartnerApi.new_using_api_key(Constants::CHANNEL_PARTNER_API_KEY)
# for a comment on this expansion, see getChannelPartnerOrder sample.
expansion = "item,summary,shipping"

# This order MUST be an order associated with this channel partner, or you will receive a 400 Bad Request.
order_id = 'DEMO-0009106820'
api_response = channel_partner_api.get_channel_partner_order(order_id, _expand: expansion)

if api_response.error
  STDERR.puts api_response.error.developer_message
  STDERR.puts api_response.error.user_message
  exit
end

order = api_response.order

# RefundReason may be required, but is optional by default.
# RefundReason may be a set list, or may be freeform. This is configured on the backend (secure.ultracart.com)
# by Navigating to Home -> Configuration -> Order Management -> Refund/Reject Reasons
# Warning: If this is a 2nd refund after an initial partial refund, be sure you account for the units and amount already refunded.
order.refund_reason = 'Damage Product'
order.summary.tax_refunded = order.summary.tax_refunded
order.summary.shipping_handling_refunded = order.summary.shipping_handling_total

order.items.each do |item|
  # item level refund reasons are optional, but may be required. See the above breadcrumb trail for refund reason config.
  item.refund_reason = 'DifferentItem'
  item.quantity_refunded = item.quantity
  item.total_refunded = item.total_cost_with_discount
end

reject_after_refund = false
skip_customer_notifications = true
auto_order_cancel = false # if this was an auto order, and they wanted to cancel it, set this flag to true.
# set manual_refund to true if the actual refund happened outside the system, and you just want a record of it.
# If UltraCart did not process this refund, manual_refund should be true.
manual_refund = false
reverse_affiliate_transactions = true # for a full refund, the affiliate should not get credit, or should they?
issue_store_credit = false  # if true, the customer would receive store credit instead of a return on their credit card.
auto_order_cancel_reason = nil

api_response = channel_partner_api.refund_channel_partner_order(order_id, order,
  reject_after_refund: reject_after_refund,
  skip_customer_notifications: skip_customer_notifications,
  auto_order_cancel: auto_order_cancel,
  manual_refund: manual_refund,
  reverse_affiliate_transactions: reverse_affiliate_transactions,
  issue_store_credit: issue_store_credit,
  auto_order_cancel_reason: auto_order_cancel_reason,
  _expand: expansion)

error = api_response.error
updated_order = api_response.order
# verify the updated order contains all the desired refunds. verify that refunded total is equal to total.

# Note: The error 'Request to refund an invalid amount.' means you requested a total refund amount less than or equal to zero.
p error
puts "\n\n-----------------\n\n"
p updated_order