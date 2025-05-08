import binascii
import secrets

from ultracart.model.channel_partner_order_item_property import ChannelPartnerOrderItemProperty
from ultracart.models import (ChannelPartnerOrder, ChannelPartnerOrderItem, ChannelPartnerOrderItemOption)
from samples import channel_partner_api_client
from ultracart.apis import ChannelPartnerApi


def generate_secure_random_string(length=10):
    return binascii.hexlify(secrets.token_bytes(length // 2)).decode('utf-8')

channel_partner_api = ChannelPartnerApi(channel_partner_api_client())

# ---------------------------------------------
# Example 1 - Order needs payment processing
# ---------------------------------------------

order = ChannelPartnerOrder()

order.associate_with_customer_profile_if_present = True
order.auto_approve_purchase_order = True
order.billto_address1 = "11460 Johns Creek Parkway"
order.billto_address2 = "Suite 101"
order.billto_city = "Duluth"
order.billto_company = "Widgets Inc"
order.billto_country_code = "US"
order.billto_day_phone = "6784153823"
order.billto_evening_phone = "6784154019"
order.billto_first_name = "John"
order.billto_last_name = "Smith"
order.billto_postal_code = "30097"
order.billto_state_region = "GA"
order.billto_title = "Sir"
order.email = "support@ultracart.com"
order.channel_partner_order_id = "widget-" + generate_secure_random_string(6)


order.ip_address = "34.125.95.217"

# -- Items start ---
item = ChannelPartnerOrderItem()
# item.arbitrary_unit_cost = 9.99
# item.auto_order_last_rebill_dts = datetime.now().strftime("%Y-%m-%dT%H:%M:%S+00:00")
# item.auto_order_schedule = "Weekly"

item.merchant_item_id = "shirt"
item.quantity = 1.0
item.upsell = False

item_option1 = ChannelPartnerOrderItemOption()
item_option1.name = "Size"
item_option1.value = "Small"

item_option2 = ChannelPartnerOrderItemOption()
item_option2.name = "Color"
item_option2.value = "Orange"

item.options = [item_option1, item_option2]

item_prop = ChannelPartnerOrderItemProperty()
item_prop.name = "MyPropertyName"
item_prop.value = "MyPropertyValue"
item_prop.display = True
item.properties = [item_prop]

order.items = [item]
# -- Items End ---

order.least_cost_route = True  # Give me the lowest cost shipping
order.least_cost_route_shipping_methods = ["FedEx: Ground", "UPS: Ground", "USPS: Retail Ground"]
order.mailing_list_opt_in = True

order.use_prior_payment_information_from_order_id = 'DEMO-0009105947'
# order.payment_method = "Credit Card" # Not required with use_prior

order.screen_branding_theme_code = "SF1986"
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

api_response = channel_partner_api.import_channel_partner_order(order)

print(repr(api_response))