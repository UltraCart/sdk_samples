// Bulk upsert customers — end-to-end lifecycle with operation="upsert".
//
// "upsert" creates a customer when none is found and otherwise replaces the
// existing one (a full-record replace, identical to PUT /rest/v2/customer — a
// field you omit is cleared, it is not a partial merge). Upsert is customer-only
// in v1; submitting operation="upsert" to /rest/v2/bulk/order is a 400.
//
// Identity resolution per line:
//   1. The _merchant_record_id marker from a prior landing wins (that customer is updated).
//   2. No marker -> resolve by the line's email; still no match -> insert.
// On success each record reports action="inserted" or action="updated".
//
// See bulkImportOrders.js for the fully-commented base flow; this sample highlights
// only what differs for upsert.

import { bulkApi } from '../api.js';
import { BulkJobRequest } from 'ultra_cart_rest_api_v2';

const OBJECT_TYPE = 'customer';

// Each line is what the per-record customer-create endpoint accepts, plus the
// top-level _merchant_record_id. When email is your natural key, using it as the
// _merchant_record_id makes the bulk dedupe and UC's email-uniqueness agree.
const customers = [
    {
        _merchant_record_id: 'jane@example.com',
        email: 'jane@example.com',
        first_name: 'Jane',
        last_name: 'Doe',
        billing: [{
            first_name: 'Jane', last_name: 'Doe', address1: '123 Main St',
            city: 'Austin', state_region: 'TX', postal_code: '78701', country_code: 'US', default_billing: true
        }],
        tags: ['legacy-import']
    },
    {
        _merchant_record_id: 'john@example.com',
        email: 'john@example.com',
        first_name: 'John',
        last_name: 'Smith'
    }
];

const ndjson = customers.map((customer) => JSON.stringify(customer)).join('\n');

function call(invoke) {
    return new Promise((resolve, reject) => invoke((error, data) => (error ? reject(error) : resolve(data))));
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
    const uploadUrlResponse = await call((cb) => bulkApi.bulkGenerateUploadUrl(OBJECT_TYPE, cb));
    const uploadUrl = uploadUrlResponse.upload_url;
    const s3Key = uploadUrlResponse.s3_key;
    console.log(`Upload URL issued (s3_key=${s3Key}).`);

    const putResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/x-ndjson' },
        body: ndjson
    });
    if (!putResponse.ok) {
        throw new Error(`Upload PUT failed: ${putResponse.status} ${putResponse.statusText}`);
    }
    console.log(`Uploaded ${customers.length} customers.`);

    // The only submit difference vs. insert: operation = "upsert".
    const request = new BulkJobRequest();
    request.s3_key = s3Key;
    request.operation = 'upsert';

    const submitResponse = await call((cb) => bulkApi.bulkSubmitJob(OBJECT_TYPE, request, cb));
    const jobId = submitResponse.bulk_job.job_id;
    console.log(`Submitted upsert job ${jobId} (operation=${submitResponse.bulk_job.operation}).`);

    const TERMINAL = ['succeeded', 'partial_success', 'failed', 'cancelled'];
    let job = submitResponse.bulk_job;
    while (!TERMINAL.includes(job.status)) {
        await sleep(3000);
        const jobResponse = await call((cb) => bulkApi.bulkGetJob(OBJECT_TYPE, jobId, cb));
        job = jobResponse.bulk_job;
        console.log(`  status=${job.status} processed=${job.processed_records ?? 0}/${job.total_records ?? '?'}`);
    }

    console.log(`\nJob ${jobId} finished: ${job.status}`);
    console.log(`  success=${job.success_count} failed=${job.fail_count} duplicate=${job.duplicate_count}`);

    // On upsert, each successful record tells you whether it created or replaced a
    // customer via the "action" field (inserted | updated).
    console.log('\nPer-record actions:');
    let cursor;
    do {
        const opts = { status: 'success', limit: 100 };
        if (cursor) opts.cursor = cursor;
        const recordsResponse = await call((cb) => bulkApi.bulkGetJobRecords(OBJECT_TYPE, jobId, opts, cb));
        for (const record of recordsResponse.records) {
            console.log(`  [${record.merchant_record_id}] ${record.action} -> uc_id=${record.uc_id}`);
        }
        cursor = recordsResponse.next_cursor;
    } while (cursor);

    if (job.fail_count > 0) {
        console.log('\nFailed records (an email_conflict means the line\'s email belongs to a different customer than the marker resolved to):');
        cursor = undefined;
        do {
            const opts = { status: 'failed', limit: 100 };
            if (cursor) opts.cursor = cursor;
            const recordsResponse = await call((cb) => bulkApi.bulkGetJobRecords(OBJECT_TYPE, jobId, opts, cb));
            for (const record of recordsResponse.records) {
                console.log(`  line ${record.line_number} [${record.merchant_record_id}] ${record.error_code}: ${record.error_message}`);
            }
            cursor = recordsResponse.next_cursor;
        } while (cursor);
    }
}

main().catch((error) => {
    const detail = error && error.response && error.response.text ? error.response.text : (error.message || error);
    console.error('Bulk upsert failed:', detail);
    process.exit(1);
});
