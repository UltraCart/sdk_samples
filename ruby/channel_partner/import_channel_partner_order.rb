# To run channel partner examples, you will need:
# 1) An API Key: https://secure.ultracart.com/merchant/configuration/apiManagementApp.do
# 2) That API Key must be assigned to a channel partner: https://secure.ultracart.com/merchant/configuration/customChannelPartnerListLoad.do
#
# The spreadsheet import docs will serve you well here. They describe many fields
# https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377246/Channel+Partner+API+-+Spreadsheet+Import

require 'ultracart_api'
require_relative '../constants'

channel_partner_api = UltracartClient::ChannelPartnerApi.new_using_api_key(Constants::CHANNEL_PARTNER_API_KEY)

# NOTICE:
# The real difficulty with using this API is the hosted fields requirement for credit card information.
# You will need to incorporate UltraCart hosted fields in your Customer Service UI and capture credit card
# information through the hosted fields and then provide the tokens here. You CANNOT provide raw credit
# card information via this interface.
# The two fields in this API are hostedFieldsCardToken and hostedFieldsCvvToken
# Within this sdk_samples github project, review the /hosted_fields/hosted_fields.html file for an example

# ---------------------------------------------
# ---------------------------------------------
# Example 1 - Order needs payment processing
# ---------------------------------------------
# ---------------------------------------------

order = UltracartClient::ChannelPartnerOrder.new

# order.advertising_source = "Friend" # https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377001/Advertising+Sources
# order.affiliate_id = 856234 # https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377727/Affiliates
# order.affiliate_sub_id = 1234 # https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1376754/Allowing+Affiliates+to+use+Sub-IDs
# order.arbitrary_shipping_handling_total = 9.99
# order.arbitrary_tax = 2.50
# order.arbitrary_tax_rate = 7.0
# order.arbitrary_taxable_subtotal = 69.99

order.associate_with_customer_profile_if_present = true
order.auto_approve_purchase_order = true
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
order.cc_email = "orders@widgets.com"
order.channel_partner_order_id = "widget-1245-abc"
order.consider_recurring = false
order.coupons = ["10OFF", "BUY1GET1"]

order.credit_card_expiration_month = 5
order.credit_card_expiration_year = 2032
order.credit_card_type = "VISA" # see the hosted fields below for the card number and cvv tokens
order.custom_field1 = "Whatever"
order.custom_field2 = "You"
order.custom_field3 = "Want"
order.custom_field4 = "Can"
order.custom_field5 = "Go"
order.custom_field6 = "In"
order.custom_field7 = "CustomFields"
order.delivery_date = Time.now.strftime('%Y-%m-%dT00:00:00+00:00')
order.email = "ceo@widgets.com"
order.gift = false

order.gift_email = "sally@aol.com"
order.gift_message = "Congratulations on your promotion!"

order.hosted_fields_card_token = "7C97B0AAA26AB10180B4B29F00380101"
order.hosted_fields_cvv_token = "C684AB4336787F0180B4B51971380101"

order.ip_address = "34.125.95.217"

# -- Items start ---
item = UltracartClient::ChannelPartnerOrderItem.new
# item.arbitrary_unit_cost = 9.99
# item.auto_order_last_rebill_dts = Time.now.strftime('%Y-%m-%dT00:00:00+00:00')
# item.auto_order_schedule = "Weekly"

item.merchant_item_id = "shirt"
item.quantity = 1
item.upsell = false

item_option1 = UltracartClient::ChannelPartnerOrderItemOption.new
item_option1.name = "Size"
item_option1.value = "Small"

item_option2 = UltracartClient::ChannelPartnerOrderItemOption.new
item_option2.name = "Color"
item_option2.value = "Orange"

item.options = [item_option1, item_option2]

order.items = [item]
# -- Items End ---

order.least_cost_route = true # Give me the lowest cost shipping
order.least_cost_route_shipping_methods = ["FedEx: Ground", "UPS: Ground", "USPS: Priority"]
order.mailing_list_opt_in = true # Yes, I confirmed with the customer personally they wish to be on my mailing lists.
order.no_realtime_payment_processing = false
order.payment_method = "Credit Card"
order.rotating_transaction_gateway_code = "MyStripe" # We wish this to be charged against our Stripe gateway
order.screen_branding_theme_code = "SF1986" # Theme codes predated StoreFronts. Each StoreFront still has a theme code under the hood
order.ship_on_date = Time.now.strftime('%Y-%m-%dT00:00:00+00:00')
order.ship_to_residential = true
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
order.skip_payment_processing = false
order.special_instructions = "Please wrap this in bubble wrap because my FedEx delivery guy is abusive to packages"
order.store_completed = false # this will bypass everything, including shipping. useful only for importing old orders long completed
order.storefront_host_name = 'store.mysite.com'
order.store_if_payment_declines = false # if payment fails, this can send it to Accounts Receivable. Do not want that. Fail if payment fails.
order.tax_county = "Gwinnett"
order.tax_exempt = false

order_transaction = UltracartClient::ChannelPartnerOrderTransaction.new
order_transaction.successful = false # we haven't charged the card yet, so this is false
order_transaction.details = [] # we haven't charged the card yet, so this is empty
order.transaction = order_transaction
order.treat_warnings_as_errors = true

api_response = channel_partner_api.import_channel_partner_order(order)

# ---------------------------------------------
# ---------------------------------------------
# Example 2 - Order already processed
# ---------------------------------------------
# ---------------------------------------------

order = UltracartClient::ChannelPartnerOrder.new

order.associate_with_customer_profile_if_present = true
order.auto_approve_purchase_order = true
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
order.cc_email = "orders@widgets.com"
order.channel_partner_order_id = "widget-1245-abc"
order.consider_recurring = false
order.coupons = ["10OFF", "BUY1GET1"]

order.credit_card_expiration_month = 5
order.credit_card_expiration_year = 2032
order.credit_card_type = "VISA"
order.custom_field1 = "Whatever"
order.custom_field2 = "You"
order.custom_field3 = "Want"
order.custom_field4 = "Can"
order.custom_field5 = "Go"
order.custom_field6 = "In"
order.custom_field7 = "CustomFields"
order.delivery_date = Time.now.strftime('%Y-%m-%dT00:00:00+00:00')
order.email = "ceo@widgets.com"
order.gift = false

order.gift_email = "sally@aol.com"
order.gift_message = "Congratulations on your promotion!"

order.ip_address = "34.125.95.217"

# -- Items start ---
item = UltracartClient::ChannelPartnerOrderItem.new

item.merchant_item_id = "shirt"
item.quantity = 1
item.upsell = false

item_option1 = UltracartClient::ChannelPartnerOrderItemOption.new
item_option1.name = "Size"
item_option1.value = "Small"

item_option2 = UltracartClient::ChannelPartnerOrderItemOption.new
item_option2.name = "Color"
item_option2.value = "Orange"

item.options = [item_option1, item_option2]

order.items = [item]
# -- Items End ---

order.mailing_list_opt_in = true # Yes, I confirmed with the customer personally they wish to be on my mailing lists.
order.no_realtime_payment_processing = true # nothing to charge, payment was already collected
order.payment_method = "Credit Card"
order.rotating_transaction_gateway_code = "MyStripe" # We wish this to be charged against our Stripe gateway
order.screen_branding_theme_code = "SF1986" # Theme codes predated StoreFronts. Each StoreFront still has a theme code under the hood
order.ship_on_date = Time.now.strftime('%Y-%m-%dT00:00:00+00:00')
order.ship_to_residential = true
order.shipping_method = "FedEx: Ground"
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
order.skip_payment_processing = true # bypass payment
order.special_instructions = "Please wrap this in bubble wrap because my FedEx delivery guy is abusive to packages"
order.store_completed = true # this is an old order or an order handled completely outside UltraCart, so do not do anything to it. Just store it.
order.storefront_host_name = 'store.mysite.com'
order.store_if_payment_declines = false # if payment fails, this can send it to Accounts Receivable. Do not want that. Fail if payment fails.
order.tax_county = "Gwinnett"
order.tax_exempt = false

order_transaction = UltracartClient::ChannelPartnerOrderTransaction.new
order_transaction.successful = true

td1 = UltracartClient::ChannelPartnerOrderTransactionDetail.new
td1.name = "AVS Code"
td1.value = "X"

td2 = UltracartClient::ChannelPartnerOrderTransactionDetail.new
td2.name = "Authorization Code"
td2.value = "123456"

td3 = UltracartClient::ChannelPartnerOrderTransactionDetail.new
td3.name = "CVV Code"
td3.value = "M"

td4 = UltracartClient::ChannelPartnerOrderTransactionDetail.new
td4.name = "Response Code"
td4.value = "Authorized"

td5 = UltracartClient::ChannelPartnerOrderTransactionDetail.new
td5.name = "Reason Code"
td5.value = "1"

td6 = UltracartClient::ChannelPartnerOrderTransactionDetail.new
td6.name = "Response Subcode"
td6.value = "1"

td7 = UltracartClient::ChannelPartnerOrderTransactionDetail.new
td7.name = "Transaction ID"
td7.value = "1234567890"

order_transaction.details = [td1, td2, td3, td4, td5, td6, td7]
order.transaction = order_transaction
order.treat_warnings_as_errors = true

api_response = channel_partner_api.import_channel_partner_order(order)