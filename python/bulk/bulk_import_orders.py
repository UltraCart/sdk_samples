# Bulk import orders - end-to-end lifecycle.
#
# The bulk API is a throughput multiplier for the per-record REST endpoints: you
# upload an NDJSON file of records, submit one job, then poll it to completion.
#
# Flow demonstrated here:
#   1. Build an NDJSON payload (one order per line, each with a stable _merchant_record_id).
#   2. Ask the Bulk API for a presigned S3 upload URL.
#   3. PUT the NDJSON bytes straight to that URL (this step does NOT go through the SDK).
#   4. Submit the job. Orders are insert-only; operation defaults to "insert".
#   5. Poll the job until it reaches a terminal status.
#   6. Print the counts and list any failed records.
#
# For create-or-update semantics, see bulk_upsert_customers.py (customer upsert).

import json
import time
import urllib.request

from ultracart.apis import BulkApi
from ultracart.models import BulkJobRequest
from ultracart.rest import ApiException
from samples import api_client

OBJECT_TYPE = 'order'

# Terminal job statuses - stop polling once the job reaches one of these.
TERMINAL_STATUSES = {'succeeded', 'partial_success', 'failed', 'cancelled'}

# --- 1. Build the NDJSON payload -------------------------------------------
# Each line is exactly what POST /rest/v2/order accepts, PLUS a top-level
# _merchant_record_id - the bulk-surface dedupe key. Use a STABLE value derived
# from your source system (e.g. the legacy order id), NOT a fresh UUID, so that
# re-running a fixed file collapses to the original landing instead of re-inserting.
#
# Build the lines as PLAIN dicts, not SDK model instances: _merchant_record_id is
# a bulk-surface marker, not a field on the per-record Order model.
orders = [
    {
        '_merchant_record_id': 'legacy-order-1029384',
        'merchant_order_id': 'ORD-1029384',
        'creation_dts': '2023-11-14T09:22:00Z',
        'currency_code': 'USD',
        'total': 79.50,
        'customer_profile': {'email': 'jane@example.com'},
        'items': [
            {'merchant_item_id': 'WIDGET-RED', 'quantity': 2,
             'unit_cost': {'currency_code': 'USD', 'value': 35.00}}
        ],
        'shipping': {
            'ship_to': {
                'first_name': 'Jane', 'last_name': 'Doe', 'address1': '123 Main St',
                'city': 'Austin', 'state_region': 'TX', 'postal_code': '78701', 'country_code': 'US'
            },
            'shipping_method': 'Standard'
        }
    },
    {
        '_merchant_record_id': 'legacy-order-1029385',
        'merchant_order_id': 'ORD-1029385',
        'creation_dts': '2023-11-15T14:03:00Z',
        'currency_code': 'USD',
        'total': 35.00,
        'customer_profile': {'email': 'john@example.com'},
        'items': [
            {'merchant_item_id': 'WIDGET-BLUE', 'quantity': 1,
             'unit_cost': {'currency_code': 'USD', 'value': 35.00}}
        ]
    }
]

# NDJSON = one minified JSON object per line, LF-separated, UTF-8. Do NOT wrap the
# records in a JSON array and do NOT pretty-print - the worker parses the file line
# by line. json.dumps with compact separators keeps each record on a single line.
ndjson = '\n'.join(json.dumps(order, separators=(',', ':')) for order in orders)


def main():
    bulk_api = BulkApi(api_client())

    # --- 2. Get a presigned upload URL --------------------------------------
    upload_url_response = bulk_api.bulk_generate_upload_url(OBJECT_TYPE)
    upload_url = upload_url_response.upload_url
    s3_key = upload_url_response.s3_key
    print(f"Upload URL issued (s3_key={s3_key}, "
          f"max_records={upload_url_response.get('max_records', '?')}).")

    # --- 3. Upload the NDJSON straight to the presigned URL ------------------
    # A plain HTTP PUT to S3 using the standard library; this does NOT go through
    # the SDK (the presigned URL already carries its own auth).
    body = ndjson.encode('utf-8')
    put_request = urllib.request.Request(
        upload_url, data=body, method='PUT',
        headers={'Content-Type': 'application/x-ndjson'})
    with urllib.request.urlopen(put_request) as put_response:
        if put_response.status not in (200, 201):
            raise RuntimeError(f"Upload PUT failed: {put_response.status} {put_response.reason}")
    print(f"Uploaded {len(orders)} records ({len(body)} bytes).")

    # --- 4. Submit the job --------------------------------------------------
    # Orders are insert-only; operation defaults to "insert" but is shown for clarity.
    request = BulkJobRequest(s3_key=s3_key, operation='insert')
    # request.webhook_url = 'https://example.com/hooks/bulk'  # optional one-shot completion POST

    submit_response = bulk_api.bulk_submit_job(OBJECT_TYPE, request)
    job = submit_response.bulk_job
    job_id = job.job_id
    print(f"Submitted job {job_id} (status={job.status}).")

    # --- 5. Poll until terminal ---------------------------------------------
    # Bulk endpoints sit behind their own rate-limit bucket, so polling does not
    # consume your normal REST budget - but still poll politely and bound the loop.
    for _ in range(20):
        if job.get('status') in TERMINAL_STATUSES:
            break
        time.sleep(3)
        job = bulk_api.bulk_get_job(OBJECT_TYPE, job_id).bulk_job
        print(f"  status={job.get('status')} "
              f"processed={job.get('processed_records', 0)}/{job.get('total_records', '?')}")

    # --- 6. Report ----------------------------------------------------------
    print(f"\nJob {job_id} finished: {job.get('status')}")
    print(f"  success={job.get('success_count', 0)} "
          f"failed={job.get('fail_count', 0)} duplicate={job.get('duplicate_count', 0)}")

    if job.get('fail_count', 0) > 0:
        print('\nFailed records:')
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
        # ApiException's __str__ includes the HTTP status and response body.
        print('Bulk import failed:')
        print(e)
        import sys
        sys.exit(1)
