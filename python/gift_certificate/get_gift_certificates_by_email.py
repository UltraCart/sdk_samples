# get a gift certificate by gift_certificate_oid.

from ultracart.apis import GiftCertificateApi
from ultracart.rest import ApiException
from pprint import pprint
from samples import api_client

api_instance = GiftCertificateApi(api_client())

try:

    email = "support@ultracart.com"

    # by_email does not take an expansion variable.  it will return the entire object by default.
    gc_response = api_instance.get_gift_certificates_by_email(email)
    gift_certificates = gc_response.gift_certificates

    pprint(gift_certificates)

except ApiException as e:
    print("Exception when calling GiftCertificateApi->get_gift_certificates_by_email: %s\n" % e)
