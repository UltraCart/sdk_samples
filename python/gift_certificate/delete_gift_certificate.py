# delete a gift certificate

from ultracart.apis import GiftCertificateApi
from ultracart.rest import ApiException
from pprint import pprint
from samples import api_client

api_instance = GiftCertificateApi(api_client())

try:

    gift_certificate_oid = 676777

    # by_code does not take an expansion variable.  it will return the entire object by default.
    api_instance.delete_gift_certificate(gift_certificate_oid)

    # if I query the gift certificate now, it will still return to me, but the deleted property will be True
    gc_response = api_instance.get_gift_certificate_by_oid(gift_certificate_oid)
    gift_certificate = gc_response.gift_certificate

    pprint(gift_certificate)

except ApiException as e:
    print("Exception when calling GiftCertificateApi->delete_gift_certificate: %s\n" % e)
