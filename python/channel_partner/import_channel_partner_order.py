from datetime import datetime
from ultracart.models import (ChannelPartnerOrder, ChannelPartnerOrderItem, 
    ChannelPartnerOrderItemOption, ChannelPartnerOrderTransaction, 
    ChannelPartnerOrderTransactionDetail)
from samples import channel_partner_api_client
from ultracart.apis import ChannelPartnerApi

channel_partner_api = ChannelPartnerApi(channel_partner_api_client())

# ---------------------------------------------
# Example 1 - Order needs payment processing
# ---------------------------------------------

order = ChannelPartnerOrder()

# order.advertising_source = "Friend"  # https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377001/Advertising+Sources
# order.affiliate_id = 856234  # https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377727/Affiliates
# order.affiliate_sub_id = 1234  # https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1376754/Allowing+Affiliates+to+use+Sub-IDs
# order.arbitrary_shipping_handling_total = 9.99
# order.arbitrary_tax = 2.50
# order.arbitrary_tax_rate = 7.0
# order.arbitrary_taxable_subtotal = 69.99

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
order.cc_email = "orders@widgets.com"
order.channel_partner_order_id = "widget-1245-abc"
order.consider_recurring = False
order.coupons = ["10OFF", "BUY1GET1"]

# order.credit_card_authorization_amount = 69.99
# order.credit_card_authorization_dts = datetime.now().strftime("%Y-%m-%dT%H:%M:%S+00:00")
# order.credit_card_authorization_number = "1234"

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
order.delivery_date = datetime.now().strftime("%Y-%m-%dT%H:%M:%S+00:00")
order.email = "ceo@widgets.com"
order.gift = False

order.gift_email = "sally@aol.com"
order.gift_message = "Congratulations on your promotion!"

order.hosted_fields_card_token = "7C97B0AAA26AB10180B4B29F00380101"
order.hosted_fields_cvv_token = "C684AB4336787F0180B4B51971380101"

# order.insurance_application_id = insurance_application_id  # specialized merchants only
# order.insurance_claim_id = insurance_claim_id  # specialized merchants only

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

order.items = [item]
# -- Items End ---

order.least_cost_route = True  # Give me the lowest cost shipping
order.least_cost_route_shipping_methods = ["FedEx: Ground", "UPS: Ground", "USPS: Priority"]
order.mailing_list_opt_in = True
order.no_realtime_payment_processing = False
order.payment_method = "Credit Card"
# order.purchase_order_number = "PO-12345"
order.rotating_transaction_gateway_code = "MyStripe"
order.screen_branding_theme_code = "SF1986"
order.ship_on_date = datetime.now().strftime("%Y-%m-%dT%H:%M:%S+00:00")
order.ship_to_residential = True
# order.shipping_method = "FedEx: Ground"  # Using LeastCostRoute instead
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
order.skip_payment_processing = False
order.special_instructions = "Please wrap this in bubble wrap because my FedEx delivery guy is abusive to packages"
order.store_completed = False
order.storefront_host_name = 'store.mysite.com'
order.store_if_payment_declines = False
order.tax_county = "Gwinnett"
order.tax_exempt = False

order_transaction = ChannelPartnerOrderTransaction()
order_transaction.successful = False  # haven't charged card yet
order_transaction.details = []  # haven't charged card yet
order.transaction = order_transaction
order.treat_warnings_as_errors = True

api_response = channel_partner_api.import_channel_partner_order(order)

# ---------------------------------------------
# Example 2 - Order already processed
# ---------------------------------------------

order = ChannelPartnerOrder()

# order.advertising_source = "Friend"
# order.affiliate_id = 856234
# order.affiliate_sub_id = 1234
# order.arbitrary_shipping_handling_total = 9.99
# order.arbitrary_tax = 2.50
# order.arbitrary_tax_rate = 7.0
# order.arbitrary_taxable_subtotal = 69.99

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
order.cc_email = "orders@widgets.com"
order.channel_partner_order_id = "widget-1245-abc"
order.consider_recurring = False
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
order.delivery_date = datetime.now().strftime("%Y-%m-%dT%H:%M:%S+00:00")
order.email = "ceo@widgets.com"
order.gift = False

order.gift_email = "sally@aol.com"
order.gift_message = "Congratulations on your promotion!"

order.ip_address = "34.125.95.217"

# -- Items start ---
item = ChannelPartnerOrderItem()
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

order.items = [item]
# -- Items End ---

order.mailing_list_opt_in = True
order.no_realtime_payment_processing = True  # payment already collected
order.payment_method = "Credit Card"
order.rotating_transaction_gateway_code = "MyStripe"
order.screen_branding_theme_code = "SF1986"
order.ship_on_date = datetime.now().strftime("%Y-%m-%dT%H:%M:%S+00:00")
order.ship_to_residential = True
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
order.skip_payment_processing = True  # bypass payment
order.special_instructions = "Please wrap this in bubble wrap because my FedEx delivery guy is abusive to packages"
order.store_completed = True  # old order, just store it
order.storefront_host_name = 'store.mysite.com'
order.store_if_payment_declines = False
order.tax_county = "Gwinnett"
order.tax_exempt = False

order_transaction = ChannelPartnerOrderTransaction()
order_transaction.successful = True

# Create transaction details
td1 = ChannelPartnerOrderTransactionDetail()
td1.name = "AVS Code"
td1.value = "X"

td2 = ChannelPartnerOrderTransactionDetail()
td2.name = "Authorization Code"
td2.value = "123456"

td3 = ChannelPartnerOrderTransactionDetail()
td3.name = "CVV Code"
td3.value = "M"

td4 = ChannelPartnerOrderTransactionDetail()
td4.name = "Response Code"
td4.value = "Authorized"

td5 = ChannelPartnerOrderTransactionDetail()
td5.name = "Reason Code"
td5.value = "1"

td6 = ChannelPartnerOrderTransactionDetail()
td6.name = "Response Subcode"
td6.value = "1"

td7 = ChannelPartnerOrderTransactionDetail()
td7.name = "Transaction ID"
td7.value = "1234567890"

order_transaction.details = [td1, td2, td3, td4, td5, td6, td7]
order.transaction = order_transaction
order.treat_warnings_as_errors = True

api_response = channel_partner_api.import_channel_partner_order(order)