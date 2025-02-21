"""
This is a helper function for call centers to calculate the shipping cost on an order. In a typical flow, the call center
will collect all the shipping information and items being purchased into a ChannelPartnerOrder object.
They will then call this method, passing in the order object. The response will contain the shipping estimates
that the call center can present to the customer. Once the customer selects a particulate estimate,
they can then plug that cost into their call center application and complete the order.

Possible Errors:
Using an API key that is not tied to a channel partner: "This API Key does not have permission to interact with channel partner orders. Please review your Channel Partner configuration."
Order has invalid channel partner code: "Invalid channel partner code"
Order has no items: "null order.items passed." or "order.items array contains a null entry."
Order has no channel partner order id: "order.channelPartnerOrderId must be specified."
Order channel partner order id is a duplicate: "order.channelPartnerOrderId [XYZ] already used."
Channel Partner is inactive: "partner is inactive."
"""

from ultracart.apis import ChannelPartnerApi
from ultracart.models import ChannelPartnerOrder, ChannelPartnerOrderItem, ChannelPartnerOrderItemOption
from samples import channel_partner_api_client
from datetime import datetime, timedelta

channel_partner_api = ChannelPartnerApi(channel_partner_api_client())

order = ChannelPartnerOrder()
order.channel_partner_order_id = "widget-1245-abc-1"
order.coupons = ["10OFF"]
# Delivery date will impact shipping estimates if there is a delivery deadline.
# order.delivery_date = (datetime.now() + timedelta(days=14)).isoformat()

item = ChannelPartnerOrderItem()
# item.arbitrary_unit_cost = 9.99
# item.auto_order_last_rebill_dts = (datetime.now() - timedelta(days=30)).isoformat()
# item.auto_order_schedule = "Weekly"
item.merchant_item_id = "shirt"

size_option = ChannelPartnerOrderItemOption()
size_option.name = "Size"
size_option.value = "Small"

color_option = ChannelPartnerOrderItemOption()
color_option.name = "Color"
color_option.value = "Orange"

item.options = [size_option, color_option]
item.quantity = 1
item.upsell = False

order.items = [item]

# order.ship_on_date = (datetime.now() + timedelta(days=7)).isoformat()
order.ship_to_residential = True
order.shipto_address1 = "55 Main Street"
order.shipto_address2 = "Suite 202"
order.shipto_city = "Duluth"
order.shipto_company = "Widgets Inc"
order.shipto_country_code = "US"
order.shipto_day_phone = "6785552323"
order.shipto_evening_phone = "7703334444"
order.shipto_first_name = "Sally"
order.shipto_last_name = "McGonkyDee"
order.shipto_postal_code = "30097"
order.shipto_state_region = "GA"
order.shipto_title = "Director"

api_response = channel_partner_api.estimate_shipping_for_channel_partner_order(order)
estimates = api_response.estimates

# TODO: Apply one estimate shipping method (name) and cost to your channel partner order.

for estimate in estimates:
    print(estimate)
