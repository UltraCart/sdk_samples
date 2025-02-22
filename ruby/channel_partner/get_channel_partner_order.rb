require 'ultracart_api'
require_relative '../constants'

# ChannelPartnerApi.get_channel_partner_order() retrieves a single order for a given order_id.  It is identical to the
# OrderApi.get_order() call, but allows for a restricted permission set.  The channel partner api assumes
# a tie to a Channel Partner and only allows retrieval of orders created by that Channel Partner.

channel_partner_api = UltracartClient::ChannelPartnerApi.new_using_api_key(Constants::CHANNEL_PARTNER_API_KEY)

# The expansion variable instructs UltraCart how much information to return.  The order object is large and
# while it's easily manageable for a single order, when querying thousands of orders, is useful to reduce
# payload size.
# see www.ultracart.com/api/ for all the expansion fields available (this list below may become stale)
#
# Possible Order Expansions:
# affiliate           affiliate.ledger                    auto_order
# billing             channel_partner                     checkout
# coupon              customer_profile                    digital_order
# edi                 fraud_score                         gift
# gift_certificate    internal                            item
# linked_shipment     marketing                          payment
# payment.transaction quote                               salesforce
# shipping            shipping.tracking_number_details    summary
# taxes

# A channel partner will almost always query an order for the purpose of turning around and submitting it to a refund call.
# As such, the expansion most likely needed is listed below.
_expand = "item,summary,shipping"

# This order MUST be an order associated with this channel partner or you will receive a 400 Bad Request.
order_id = 'DEMO-0009110366'
api_response = channel_partner_api.get_channel_partner_order(order_id, { '_expand' => _expand })

if api_response.error
  STDERR.puts api_response.error.developer_message
  STDERR.puts api_response.error.user_message
  exit
end

order = api_response.order

p order