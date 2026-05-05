from ultracart.apis import ChannelPartnerApi
from ultracart.model.currency import Currency

from samples import channel_partner_api_client

# Initialize API
channel_partner_api = ChannelPartnerApi(channel_partner_api_client())

# Expansion parameter for order details
expand = "item,summary,shipping"

# Order ID must be associated with this channel partner
order_id = 'DEMO-0009106202'
api_response = channel_partner_api.get_channel_partner_order(order_id, expand=expand)

if hasattr(api_response, 'error') and api_response.error is not None:
    print(api_response.error.developer_message)
    print(api_response.error.user_message)
    exit()

order = api_response.order
print(order)

# Set refund details
order.refund_reason = 'Abandoned'
order.reject_reason = 'Abandoned'
order['summary']['tax_refunded'] = Currency()
order['summary']['tax_refunded'].value = order['summary']['tax']['value']

order['summary']['shipping_handling_refunded'] = Currency()
order['summary']['shipping_handling_refunded'].value = order['summary']['shipping_handling_total']['value']

# Process refunds for all items
for item in order['items']:
    item['refund_reason'] = 'DifferentItem'
    item['quantity_refunded'] = item['quantity']
    item['total_refunded'] = Currency()
    item['total_refunded'].value = item['total_cost_with_discount'].value

# Refund parameters
reject_after_refund = False
skip_customer_notification = True
auto_order_cancel = False  # Set True to cancel auto orders
manual_refund = True  # Set True if refund processed outside system
reverse_affiliate_transactions = True  # Whether affiliate should get credit
issue_store_credit = False  # True for store credit instead of card refund
# auto_order_cancel_reason = ''

# Process the refund
api_response = channel_partner_api.refund_channel_partner_order(
    order_id,
    order,
    reject_after_refund=reject_after_refund,
    skip_customer_notification=skip_customer_notification,
    auto_order_cancel=auto_order_cancel,
    manual_refund=manual_refund,
    reverse_affiliate_transactions=reverse_affiliate_transactions,
    issue_store_credit=issue_store_credit,
    # auto_order_cancel_reason=auto_order_cancel_reason,
    expand=expand
)

if hasattr(api_response, 'error'):
    error = api_response.error
    print(error)
    exit(1)

updated_order = api_response.order
print(updated_order)