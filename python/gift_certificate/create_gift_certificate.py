# create a gift certificate
import ultracart
from ultracart.rest import ApiException
from ultracart import ApiClient
from pprint import pprint
import time
from datetime import datetime, timedelta, date

config = ultracart.Configuration()
# this key is valid only in the UltraCart development system.  You need to supply a valid simple key here.
config.api_key['x-ultracart-simple-key'] \
    = 'a84dba2b20613c017eff4a1185380100a385a6ff6f6939017eff4a1185380100'
config.debug = False
config.verify_ssl = False  # Development only.  Set to True for production.

api_client = ApiClient(configuration=config, header_name='X-UltraCart-Api-Version', header_value='2017-03-01')
api_instance = ultracart.GiftCertificateApi(api_client)

try:

    amount = 150.75
    expiration_dts = datetime.now() + timedelta(days=180)
    expiration_dts_iso8601 = expiration_dts.astimezone().isoformat('T', 'milliseconds')
    initial_ledger_description = "Issued instead of refund"
    merchant_note = 'Problem Order: blah-12345\nIssued gift certificate due to stale product.' \
                    '\nIssued By: Customer Service Rep Joe Smith'
    email = 'support@ultracart.com'
    gc_create_request = ultracart.GiftCertificateCreateRequest(amount, email, expiration_dts_iso8601,
                                                               initial_ledger_description, merchant_note)

    # create does not take an expansion variable.  it will return the entire object by default.
    gc_response = api_instance.create_gift_certificate(gc_create_request)
    gift_certificate = gc_response.gift_certificate

    pprint(gift_certificate)

except ApiException as e:
    print("Exception when calling GiftCertificateApi->create_gift_certificate: %s\n" % e)
