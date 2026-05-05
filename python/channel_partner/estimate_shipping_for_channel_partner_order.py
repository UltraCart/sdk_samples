from ultracart.apis import ChannelPartnerApi
from ultracart.models import ChannelPartnerOrder, ChannelPartnerOrderItem, ChannelPartnerOrderItemOption
from samples import channel_partner_api_client

channel_partner_api = ChannelPartnerApi(channel_partner_api_client())

order = ChannelPartnerOrder()
order.channel_partner_order_id = "widget-1245-abc-1"
order.coupons = ["10OFF"]
# DeliveryDate will impact shipping estimates if there is a delivery deadline.
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
item.quantity = 1.0
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