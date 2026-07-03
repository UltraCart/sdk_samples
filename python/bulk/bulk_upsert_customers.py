# Bulk upsert customers - end-to-end lifecycle with operation="upsert".
#
# "upsert" creates a customer when none is found and otherwise replaces the
# existing one (a full-record replace, identical to PUT /rest/v2/customer - a
# field you omit is cleared, it is not a partial merge). Upsert is customer-only
# in v1; submitting operation="upsert" to /rest/v2/bulk/order is a 400.
#
# Identity resolution per line:
#   1. The _merchant_record_id marker from a prior landing wins (that customer is updated).
#   2. No marker -> resolve by the line's email; still no match -> insert.
# On success each record reports action="inserted" or action="updated".
#
# See bulk_import_orders.py for the fully-commented base flow; this sample
# highlights only what differs for upsert.

import json
import time
import urllib.request

from ultracart.apis import BulkApi
from ultracart.models import BulkJobRequest
from ultracart.rest import ApiException
from samples import api_client

OBJECT_TYPE = 'customer'

TERMINAL_STATUSES = {'succeeded', 'partial_success', 'failed', 'cancelled'}

# Each line is what the per-record customer-create endpoint accepts, plus the
# top-level _merchant_record_id. When email is your natural key, using it as the
# _merchant_record_id makes the bulk dedupe and UC's email-uniqueness agree.
# Build plain dicts, not SDK model instances (the marker is not a Customer field).
customers = [
    {
        '_merchant_record_id': 'jane@example.com',
        'email': 'jane@example.com',
        'first_name': 'Jane',
        'last_name': 'Doe',
        'billing': [{
            'first_name': 'Jane', 'last_name': 'Doe', 'address1': '123 Main St',
            'city': 'Austin', 'state_region': 'TX', 'postal_code': '78701',
            'country_code': 'US', 'default_billing': True
        }],
        'tags': ['legacy-import']
    },
    {
        '_merchant_record_id': 'john@example.com',
        'email': 'john@example.com',
        'first_name': 'John',
        'last_name': 'Smith'
    }
]

ndjson = '\n'.join(json.dumps(customer, separators=(',', ':')) for customer in customers)


def main():
    bulk_api = BulkApi(api_client())

    upload_url_response = bulk_api.bulk_generate_upload_url(OBJECT_TYPE)
    upload_url = upload_url_response.upload_url
    s3_key = upload_url_response.s3_key
    print(f"Upload URL issued (s3_key={s3_key}).")

    # Plain HTTP PUT of the NDJSON bytes to the presigned URL (not through the SDK).
    body = ndjson.encode('utf-8')
    put_request = urllib.request.Request(
        upload_url, data=body, method='PUT',
        headers={'Content-Type': 'application/x-ndjson'})
    with urllib.request.urlopen(put_request) as put_response:
        if put_response.status not in (200, 201):
            raise RuntimeError(f"Upload PUT failed: {put_response.status} {put_response.reason}")
    print(f"Uploaded {len(customers)} customers.")

    # The only submit difference vs. insert: operation = "upsert".
    request = BulkJobRequest(s3_key=s3_key, operation='upsert')

    submit_response = bulk_api.bulk_submit_job(OBJECT_TYPE, request)
    job = submit_response.bulk_job
    job_id = job.job_id
    print(f"Submitted upsert job {job_id} (operation={job.get('operation')}).")

    for _ in range(20):
        if job.get('status') in TERMINAL_STATUSES:
            break
        time.sleep(3)
        job = bulk_api.bulk_get_job(OBJECT_TYPE, job_id).bulk_job
        print(f"  status={job.get('status')} "
              f"processed={job.get('processed_records', 0)}/{job.get('total_records', '?')}")

    print(f"\nJob {job_id} finished: {job.get('status')}")
    print(f"  success={job.get('success_count', 0)} "
          f"failed={job.get('fail_count', 0)} duplicate={job.get('duplicate_count', 0)}")

    # On upsert, each successful record tells you whether it created or replaced a
    # customer via the "action" field (inserted | updated).
    print('\nPer-record actions:')
    cursor = None
    while True:
        kwargs = {'status': 'success', 'limit': 100}
        if cursor:
            kwargs['cursor'] = cursor
        records_response = bulk_api.bulk_get_job_records(OBJECT_TYPE, job_id, **kwargs)
        for record in records_response.records:
            print(f"  [{record.get('merchant_record_id')}] "
                  f"{record.get('action')} -> uc_id={record.get('uc_id')}")
        cursor = records_response.get('next_cursor')
        if not cursor:
            break

    if job.get('fail_count', 0) > 0:
        print("\nFailed records (an email_conflict means the line's email belongs to a "
              "different customer than the marker resolved to):")
        cursor = None
        while True:
            kwargs = {'status': 'failed', 'limit': 100}
            if cursor:
                kwargs['cursor'] = cursor
            records_response = bulk_api.bulk_get_job_records(OBJECT_TYPE, job_id, **kwargs)
            for record in records_response.records:
                print(f"  line {record.get('line_number')} "
                      f"[{record.get('merchant_record_id')}] "
                      f"{record.get('error_code')}: {record.get('error_message')}")
            cursor = records_response.get('next_cursor')
            if not cursor:
                break


if __name__ == '__main__':
    try:
        main()
    except ApiException as e:
        print('Bulk upsert failed:')
        print(e)
        import sys
        sys.exit(1)
