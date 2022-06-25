# update a gift certificate

from ultracart.apis import GiftCertificateApi
from ultracart.rest import ApiException
from pprint import pprint
from samples import api_client

api_instance = GiftCertificateApi(api_client())

try:

    gift_certificate_oid = 676713

    # by_oid does not take an expansion variable.  it will return the entire object by default.
    gc_response = api_instance.get_gift_certificate_by_oid(gift_certificate_oid)
    gift_certificate = gc_response.gift_certificate

    gift_certificate.email = 'support@ultracart.com'

    gc_response = api_instance.update_gift_certificate(gift_certificate_oid, gift_certificate)
    gift_certificate = gc_response.gift_certificate

    pprint(gift_certificate)

except ApiException as e:
    print("Exception when calling GiftCertificateApi->update_gift_certificate: %s\n" % e)
