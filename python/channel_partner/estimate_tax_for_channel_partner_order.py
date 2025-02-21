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
ord