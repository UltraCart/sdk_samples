# import a channel partner order with eCheck payment method.
from ultracart.apis import ChannelPartnerApi
from ultracart.model.channel_partner_order import ChannelPartnerOrder
from ultracart.model.channel_partner_order_item import ChannelPartnerOrderItem
from ultracart.rest import ApiException
from pprint import pprint
from samples import api_client

api_instance = ChannelPartnerApi(api_client())

try:

    order = ChannelPartnerOrder()
    order.channel_partner_order_id = 'SOMETHING-12345'

    order.payment_method = 'eCheck'
    order.echeck_bank_aba_code = '0532-8511-5'
    order.echeck_bank_account_name = 'Joe Schmoe'
    order.echeck_bank_account_number = '1234567890'
    order.echeck_bank_account_type = 'Checking'
    order.echeck_bank_name = 'Peach State Federal Credit Union'
    order.echeck_bank_owner_type = 'Personal'
    order.echeck_customer_tax_id = '123456789'
    order.echeck_drivers_license_dob = '10/19/1954'
    order.echeck_drivers_license_number = '024659875'
    order.echeck_drivers_license_state = 'GA'

    order.email = 'test@ultracart.com'
    
    order.billto_first_name = 'Joe'
    order.billto_last_name = 'Schmoe'
    order.billto_address1 = '11460 Johns Creek Parkway'
    order.billto_city = 'Duluth'
    order.billto_state_region = 'GA'
    order.billto_postal_code = '30097'
    order.billto_country_code = 'US'
    order.billto_day_phone = '7704982664'

    order.shipto_first_name = 'Joe'
    order.shipto_last_name = 'Schmoe'
    order.shipto_address1 = '11460 Johns Creek Parkway'
    order.shipto_city = 'Duluth'
    order.shipto_state_region = 'GA'
    order.shipto_postal_code = '30097'
    order.shipto_country_code = 'US'
    order.shipto_day_phone = '7704982664'
    order.shipto_evening_phone = '7704982664'

    order.shipping_method = 'FedEx: Ground'

    item = ChannelPartnerOrderItem()
    item.merchant_item_id = 'ABC12345'
    item.quantity = 1.0
    order.items = [item]

    import_response = api_instance.import_channel_partner_order(order)

    pprint(import_response)

except ApiException as e:
    print("Exception when calling ChannelPartnerApi->import_channel_partner_order: %s\n" % e)
