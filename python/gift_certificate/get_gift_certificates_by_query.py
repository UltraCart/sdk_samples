# retrieve all items using chunking if necessary

from ultracart.apis import GiftCertificateApi
from ultracart.model.gift_certificate_query import GiftCertificateQuery
from ultracart.rest import ApiException
from samples import api_client
import time

api_instance = GiftCertificateApi(api_client())

expand = 'ledger'


def get_gift_certificates_chunk(_offset=0, _limit=200):
    gc_query = GiftCertificateQuery()
    gc_response = api_instance.get_gift_certificates_by_query(gc_query, offset=_offset, limit=_limit, expand=expand)
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
