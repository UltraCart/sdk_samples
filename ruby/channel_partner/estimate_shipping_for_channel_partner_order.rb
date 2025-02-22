require 'ultracart_api'
require_relative '../constants'

# This is a helper function for call centers to calculate the shipping cost on an order.  In a typical flow, the call center
# will collect all the shipping information and items being purchased into a ChannelPartnerOrder object.
# They will then call this method, passing in the order object.  The response will contain the shipping estimates
# that the call center can present to the customer.  Once the customer selects a particulate estimate,
# they can then plug that cost into their call center application and complete the order.
#
# Possible Errors:
# Using an API key that is not tied to a channel partner: "This API Key does not have permission to interact with channel partner orders.  Please review your Channel Partner configuration."
# Order has invalid channel partner code: "Invalid channel partner code"
# Order has no items: "null order.items passed." or "order.items array contains a null entry."
# Order has no channel partner order id: "order.channelPartnerOrderId must be specified."
# Order channel partner order id is a duplicate:  "order.channelPartnerOrderId [XYZ] already used."
# Channel Partner is inactive: "partner is inactive."

channel_partner_api = UltracartClient::ChannelPartnerApi.new_using_api_key(Constants::CHANNEL_PARTNER_API_KEY)

order = UltracartClient::ChannelPartnerOrder.new
order.channel_partner_order_id = "widget-1245-abc-1"
order.coupons = ["10OFF"]
# DeliveryDate will impact shipping estimates if there is a delivery deadline.
# order.delivery_date = (Time.now + (14 * 24 * 60 * 60)).iso8601

item = UltracartClient::ChannelPartnerOrderItem.new
# item.arbitrary_unit_cost = 9.99
# item.auto_order_last_rebill_dts = (Time.now - (30 * 24 * 60 * 60)).iso8601
# item.auto_order_schedule = "Weekly"
item.merchant_item_id = "shirt"

size_option = UltracartClient::ChannelPartnerOrderItemOption.new
size_option.name = "Size"
size_option.value = "Small"

color_option = UltracartClient::ChannelPartnerOrderItemOption.new
color_option.name = "Color"
color_option.value = "Orange"

item.options = [size_option, color_option]
item.quantity = 1
item.upsell = false

order.items = [item]

# order.ship_on_date = (Time.now + (7 * 24 * 60 * 60)).iso8601
order.ship_to_residential = true
order.ship_to_address1 = "55 Main Street"
order.ship_to_address2 = "Suite 202"
order.ship_to_city = "Duluth"
order.ship_to_company = "Widgets Inc"
order.ship_to_country_code = "US"
order.ship_to_day_phone = "6785552323"
order.ship_to_evening_phone = "7703334444"
order.ship_to_first_name = "Sally"
order.ship_to_last_name = "McGonkyDee"
order.ship_to_postal_code = "30097"
order.ship_to_state_region = "GA"
order.ship_to_title = "Director"

api_response = channel_partner_api.estimate_shipping_for_channel_partner_order(order)
estimates = api_response.estimates

# TODO: Apply one estimate shipping method (name) and cost to your channel partner order.

estimates.each do |estimate|
  p estimate
end