#  add a gift certificate ledger entry.  this is how you affect the remaining balance.
from ultracart.apis import GiftCertificateApi
from ultracart.model.gift_certificate_ledger_entry import GiftCertificateLedgerEntry
from ultracart.rest import ApiException
from pprint import pprint
from samples import api_client
from datetime import datetime

api_instance = GiftCertificateApi(api_client())

try:

    amount = -65.35  # this is the change in the gc.  this is not a balance.  it will be subtracted from it.
    description = "Customer bought something."
    entry_dts = datetime.now().astimezone().isoformat('T', 'milliseconds')
    gift_certificate_oid = 676713  # this is an existing gift certificate oid.  I created it using create_gift_certificate.py
    reference_order_id = 'BLAH-12345'  # if this ledger entry is related to an order, add it here, else use null.
    ledger_entry = GiftCertificateLedgerEntry(amount=amount,
                                              description=description,
                                              entry_dts=entry_dts,
                                              gift_certificate_oid=gift_certificate_oid,
                                              reference_order_id=reference_order_id)

    # create does not take an expansion variable.  it will return the entire object by default.
    gc_response = api_instance.add_gift_certificate_ledger_entry(gift_certificate_oid, ledger_entry)
    gift_certificate = gc_response.gift_certificate

    pprint(gift_certificate)

except ApiException as e:
    print("Exception when calling GiftCertificateApi->add_gift_certificate_ledger_entry: %s\n" % e)
