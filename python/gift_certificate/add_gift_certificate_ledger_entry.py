#  add a gift certificate ledger entry.  this is how you affect the remaining balance.
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

    amount = -65.35  # this is the change in the gc.  this is not a balance.  it will be subtracted from it.
    description = "Customer bought something over the counter using this gift certificate."
    entry_dts = datetime.now().astimezone().isoformat('T', 'milliseconds')
    gift_certificate_ledger_oid = None  # the system will assign an oid.  do not assign one here.
    gift_certificate_oid = 676713  # this is an existing gift certificate oid.  I created it using create_gift_certificate.py
    reference_order_id = 'BLAH-12345'  # if this ledger entry is related to an order, add it here, else use null.
    ledger_entry = ultracart.GiftCertificateLedgerEntry(amount, description, entry_dts, gift_certificate_ledger_oid,
                                                        gift_certificate_oid, reference_order_id)

    # create does not take an expansion variable.  it will return the entire object by default.
    gc_response = api_instance.add_gift_certificate_ledger_entry(gift_certificate_oid, ledger_entry)
    gift_certificate = gc_response.gift_certificate

    pprint(gift_certificate)

except ApiException as e:
    print("Exception when calling GiftCertificateApi->add_gift_certificate_ledger_entry: %s\n" % e)
