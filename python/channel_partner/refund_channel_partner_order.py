from ultracart.apis import ChannelPartnerApi
from samples import channel_partner_api_client

# Initialize API
channel_partner_api = ChannelPartnerApi(channel_partner_api_client())

# Expansion parameter for order details
expand = "item,summary,shipping"

# Order ID must be associated with this channel partner
order_id = 'DEMO-0009106820'
api_response = channel_partner_api.get_channel_partner_order(order_id, expand=expand)

if api_response.error is not None:
    print(api_response.error.developer_message)
    print(api_response.error.user_message)
    exit()

order = api_response.order

# Set refund details
order.refund_reason = 'Damage Product'
order.summary.tax_refunded = order.summary.tax_refunded
order.summary.shipping_handling_refunded = order.summary.shipping_handling_total

# Process refunds for all items
for item in order.items:
    item.refund_reason = 'DifferentItem'
    item.quantity_refunded = item.quantity
    item.total_refunded = item.total_cost_with_discount

# Refund parameters
reject_after_refund = False
skip_customer_notifications = True
auto_order_cancel = False  # Set True to cancel auto orders
manual_refund = False  # Set True if refund processed outside system
reverse_affiliate_transactions = True  # Whether affiliate should get credit
issue_store_credit = False  # True for store credit instead of card refund
auto_order_cancel_reason = None

# Process the refund
api_response = channel_partner_api.refund_channel_partner_order(
    order_id, order, reject_after_refund, skip_customer_notifications,
    auto_order_cancel, manual_refund, reverse_affiliate_transactions,
    issue_store_credit, auto_order_cancel_reason, expand=expand
)

error = api_response.error
updated_order = api_response.order
print(error)
print("\n\n")
print(updated_order)