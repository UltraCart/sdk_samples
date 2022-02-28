# update a gift certificate

import ultracart
from ultracart.rest import ApiException
from ultracart import ApiClient
from pprint import pprint

config = ultracart.Configuration()
# this key is valid only in the UltraCart development system.  You need to supply a valid simple key here.
config.api_key['x-ultracart-simple-key'] \
    = 'a84dba2b20613c017eff4a1185380100a385a6ff6f6939017eff4a1185380100'
config.debug = False
config.verify_ssl = False  # Development only.  Set to True for production.

api_client = ApiClient(configuration=config, header_name='X-UltraCart-Api-Version', header_value='2017-03-01')
api_instance = ultracart.GiftCertificateApi(api_client)

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
