# retrieve all items using chunking if necessary
import ultracart
from ultracart.rest import ApiException
from ultracart import ApiClient
from pprint import pprint
import time


config = ultracart.Configuration()
# this key is valid only in the UltraCart development system.  You need to supply a valid simple key here.
config.api_key['x-ultracart-simple-key'] \
    = 'a84dba2b20613c017eff4a1185380100a385a6ff6f6939017eff4a1185380100'
config.debug = False
config.verify_ssl = False  # Development only.  Set to True for production.

api_client = ApiClient(configuration=config, header_name='X-UltraCart-Api-Version', header_value='2017-03-01')
api_instance = ultracart.GiftCertificateApi(api_client)

expand = 'ledger'


def get_gift_certificates_chunk(offset=0, limit=200):
    gc_query = ultracart.GiftCertificateQuery()
    gc_response = api_instance.get_gift_certificates_by_query(gc_query, offset=offset, limit=limit)
    if gc_response.success:
        return gc_response.gift_certificates
    # if unsuccessful, return empty array
    return []

gift_certificates = []
try:

    iteration = 1
    offset = 0
    limit = 200
    need_more_records = True

    while need_more_records:
        print("executing iteration " + str(iteration))
        block_of_certs = get_gift_certificates_chunk(offset, limit)
        gift_certificates.extend(block_of_certs)
        offset = offset + limit
        need_more_records = len(block_of_certs) == limit
        iteration = iteration + 1
        time.sleep(3)  # pace your calls or the rate limiter was slam down on your script.

    # pprint(gift_certificates)
    rec_num = 1
    for gc in gift_certificates:
        print(rec_num, ") oid: ", gc.gift_certificate_oid, ", code: ", gc.code)
        rec_num = rec_num + 1

except ApiException as e:
    print("Exception when calling GiftCertificateApi->get_gift_certificates_by_query: %s\n" % e)