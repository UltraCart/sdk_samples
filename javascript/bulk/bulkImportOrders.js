// Bulk import orders — end-to-end lifecycle.
//
// The bulk API is a throughput multiplier for the per-record REST endpoints: you
// upload an NDJSON file of records, submit one job, then poll it to completion.
//
// Flow demonstrated here:
//   1. Build an NDJSON payload (one order per line, each with a stable _merchant_record_id).
//   2. Ask the Bulk API for a presigned S3 upload URL.
//   3. PUT the NDJSON bytes straight to that URL (this step does NOT go through the SDK).
//   4. Submit the job. Orders are insert-only; operation defaults to "insert".
//   5. Poll the job until it reaches a terminal status.
//   6. Print the counts and list any failed records.
//
// For create-or-update semantics, see bulkUpsertCustomers.js (customer upsert).

import { bulkApi } from '../api.js';
import { BulkJobRequest } from 'ultra_cart_rest_api_v2';

const OBJECT_TYPE = 'order';

// --- 1. Build the NDJSON payload -------------------------------------------
// Each line is exactly what POST /rest/v2/order accepts, PLUS a top-level
// _merchant_record_id — the bulk-surface dedupe key. Use a STABLE value derived
// from your source system (e.g. the legacy order id), NOT a fresh UUID, so that
// re-running a fixed file collapses to the original landing instead of re-inserting.
const orders = [
    {
        _merchant_record_id: 'legacy-order-1029384',
        merchant_order_id: 'ORD-1029384',
        creation_dts: '2023-11-14T09:22:00Z',
        currency_code: 'USD',
        total: 79.50,
        customer_profile: { email: 'jane@example.com' },
        items: [
            { merchant_item_id: 'WIDGET-RED', quantity: 2, unit_cost: { currency_code: 'USD', value: 35.00 } }
        ],
        shipping: {
            ship_to: {
                first_name: 'Jane', last_name: 'Doe', address1: '123 Main St',
                city: 'Austin', state_region: 'TX', postal_code: '78701', country_code: 'US'
            },
            shipping_method: 'Standard'
        }
    },
    {
        _merchant_record_id: 'legacy-order-1029385',
        merchant_order_id: 'ORD-1029385',
        creation_dts: '2023-11-15T14:03:00Z',
        currency_code: 'USD',
        total: 35.00,
        customer_profile: { email: 'john@example.com' },
        items: [
            { merchant_item_id: 'WIDGET-BLUE', quantity: 1, unit_cost: { currency_code: 'USD', value: 35.00 } }
        ]
    }
];

// NDJSON = one minified JSON object per line, LF-separated. Do NOT wrap the records
// in a JSON array and do NOT pretty-print — the worker parses the file line by line.
const ndjson = orders.map(order => JSON.stringify(order)).join('\n');

// The generated JS SDK uses (error, data, response) callbacks. Wrap them in a
// promise so the multi-step flow reads top to bottom.
function call(invoke) {
    return new Promise((resolve, reject) => invoke((error, data) => (error ? reject(error) : resolve(data))));
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
    // --- 2. Get a presigned upload URL --------------------------------------
    const uploadUrlResponse = await call((cb) => bulkApi.bulkGenerateUploadUrl(OBJECT_TYPE, cb));
    const uploadUrl = uploadUrlResponse.upload_url;
    const s3Key = uploadUrlResponse.s3_key;
    console.log(`Upload URL issued (s3_key=${s3Key}, max_records=${uploadUrlResponse.max_records}).`);

    // --- 3. Upload the NDJSON straight to the presigned URL ------------------
    // A plain HTTP PUT to S3. `fetch` is built into Node 18+.
    const putResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/x-ndjson' },
        body: ndjson
    });
    if (!putResponse.ok) {
        throw new Error(`Upload PUT failed: ${putResponse.status} ${putResponse.statusText}`);
    }
    console.log(`Uploaded ${orders.length} records (${Buffer.byteLength(ndjson)} bytes).`);

    // --- 4. Submit the job --------------------------------------------------
    const request = new BulkJobRequest();
    request.s3_key = s3Key;
    request.operation = 'insert'; // default for orders; shown here for clarity
    // request.webhook_url = 'https://example.com/hooks/bulk'; // optional one-shot completion POST

    const submitResponse = await call((cb) => bulkApi.bulkSubmitJob(OBJECT_TYPE, request, cb));
    const jobId = submitResponse.bulk_job.job_id;
    console.log(`Submitted job ${jobId} (status=${submitResponse.bulk_job.status}).`);

    // --- 5. Poll until terminal ---------------------------------------------
    // Bulk endpoints sit behind their own rate-limit bucket, so polling does not
    // consume your normal REST budget — but still poll politely.
    const TERMINAL = ['succeeded', 'partial_success', 'failed', 'cancelled'];
    let job = submitResponse.bulk_job;
    while (!TERMINAL.includes(job.status)) {
        await sleep(3000);
        const jobResponse = await call((cb) => bulkApi.bulkGetJob(OBJECT_TYPE, jobId, cb));
        job = jobResponse.bulk_job;
        console.log(`  status=${job.status} processed=${job.processed_records ?? 0}/${job.total_records ?? '?'}`);
    }

    // --- 6. Report ----------------------------------------------------------
    console.log(`\nJob ${jobId} finished: ${job.status}`);
    console.log(`  success=${job.success_count} failed=${job.fail_count} duplicate=${job.duplicate_count}`);

    if (job.fail_count > 0) {
        console.log('\nFailed records:');
        let cursor;
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
    // SDK errors carry the HTTP response body on error.response.text
    const detail = error && error.response && error.response.text ? error.response.text : (error.message || error);
    console.error('Bulk import failed:', detail);
    process.exit(1);
});
