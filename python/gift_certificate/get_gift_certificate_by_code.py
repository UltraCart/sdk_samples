# get a gift certificate by code.

from ultracart.apis import GiftCertificateApi
from ultracart.rest import ApiException
from pprint import pprint
from samples import api_client

api_instance = GiftCertificateApi(api_client())

try:

    code = 'NRQPHPCFVK'

    # by_code does not take an expansion variable.  it will return the entire object by default.
    gc_response = api_instance.get_gift_certificate_by_code(code)
    gift_certificate = gc_response.gift_certificate

    pprint(gift_certificate)

except ApiException as e:
    print("Exception when calling GiftCertificateApi->get_gift_certificate_by_code: %s\n" % e)
