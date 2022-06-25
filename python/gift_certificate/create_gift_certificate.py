# create a gift certificate
from ultracart.apis import GiftCertificateApi
from ultracart.model.gift_certificate_create_request import GiftCertificateCreateRequest
from ultracart.rest import ApiException
from pprint import pprint
from samples import api_client
from datetime import datetime, timedelta

api_instance = GiftCertificateApi(api_client())

try:

    amount = 150.75
    expiration_dts = datetime.now() + timedelta(days=180)
    expiration_dts_iso8601 = expiration_dts.astimezone().isoformat('T', 'milliseconds')
    initial_ledger_description = "Issued instead of refund"
    merchant_note = 'Problem Order: blah-12345\nIssued gift certificate due to stale product.' \
                    '\nIssued By: Customer Service Rep Joe Smith'
    email = 'support@ultracart.com'
    gc_create_request = GiftCertificateCreateRequest(amount=amount,
                                                     email=email,
                                                     expiration_dts_iso8601=expiration_dts_iso8601,
                                                     initial_ledger_description=initial_ledger_description,
                                                     merchant_note=merchant_note)

    # create does not take an expansion variable.  it will return the entire object by default.
    gc_response = api_instance.create_gift_certificate(gc_create_request)
    gift_certificate = gc_response.gift_certificate

    pprint(gift_certificate)

except ApiException as e:
    print("Exception when calling GiftCertificateApi->create_gift_certificate: %s\n" % e)
