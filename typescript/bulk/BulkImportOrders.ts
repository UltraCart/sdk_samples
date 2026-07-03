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
// For create-or-update semantics, see BulkUpsertCustomers.ts (customer upsert).

import * as https from 'https';
import { URL } from 'url';
import { bulkApi } from '../api';
import {
    BulkJob,
    BulkJobRequest,
    BulkJobRequestOperationEnum,
    BulkRecordsResponse,
} from 'ultracart_rest_api_v2_typescript';

// ReSharper disable once ClassNeverInstantiated.Global
export class BulkImportOrders {
    private static readonly OBJECT_TYPE = 'order';

    // Terminal job statuses — stop polling once the job reports one of these.
    private static readonly TERMINAL = ['succeeded', 'partial_success', 'failed', 'cancelled'];

    // Bound the poll so a stuck job can never hang the sample.
    private static readonly MAX_POLLS = 20;
    private static readonly POLL_INTERVAL_MS = 3000;

    public static async execute(): Promise<void> {
        // --- 1. Build the NDJSON payload ------------------------------------
        // Each line is exactly what POST /rest/v2/order accepts, PLUS a top-level
        // _merchant_record_id — the bulk-surface dedupe key. Use a STABLE value
        // derived from your source system (e.g. the legacy order id), NOT a fresh
        // UUID, so that re-running a fixed file collapses to the original landing
        // instead of re-inserting. These are PLAIN objects, not SDK model
        // instances, because _merchant_record_id is not an SDK model field.
        const orders: Array<Record<string, unknown>> = [
            {
                _merchant_record_id: 'legacy-order-1029384',
                merchant_order_id: 'ORD-1029384',
                creation_dts: '2023-11-14T09:22:00Z',
                currency_code: 'USD',
                total: 79.50,
                customer_profile: { email: 'jane@example.com' },
                items: [
                    { merchant_item_id: 'WIDGET-RED', quantity: 2, unit_cost: { currency_code: 'USD', value: 35.00 } },
                ],
                shipping: {
                    ship_to: {
                        first_name: 'Jane', last_name: 'Doe', address1: '123 Main St',
                        city: 'Austin', state_region: 'TX', postal_code: '78701', country_code: 'US',
                    },
                    shipping_method: 'Standard',
                },
            },
            {
                _merchant_record_id: 'legacy-order-1029385',
                merchant_order_id: 'ORD-1029385',
                creation_dts: '2023-11-15T14:03:00Z',
                currency_code: 'USD',
                total: 35.00,
                customer_profile: { email: 'john@example.com' },
                items: [
                    { merchant_item_id: 'WIDGET-BLUE', quantity: 1, unit_cost: { currency_code: 'USD', value: 35.00 } },
                ],
            },
        ];

        // NDJSON = one minified JSON object per line, LF-separated. Do NOT wrap the
        // records in a JSON array and do NOT pretty-print — the worker parses the
        // file line by line.
        const ndjson = orders.map((order) => JSON.stringify(order)).join('\n');

        // --- 2. Get a presigned upload URL ----------------------------------
        const uploadUrlResponse = await bulkApi.bulkGenerateUploadUrl({ object: BulkImportOrders.OBJECT_TYPE });
        const uploadUrl = uploadUrlResponse.upload_url;
        const s3Key = uploadUrlResponse.s3_key;
        if (!uploadUrl || !s3Key) {
            throw new Error('Bulk upload-url response did not include upload_url / s3_key.');
        }
        console.log(`Upload URL issued (s3_key=${s3Key}, max_records=${uploadUrlResponse.max_records}).`);

        // --- 3. Upload the NDJSON straight to the presigned URL -------------
        // A plain HTTP PUT to S3 — this does NOT go through the SDK.
        await BulkImportOrders.putBytes(uploadUrl, ndjson);
        console.log(`Uploaded ${orders.length} records (${Buffer.byteLength(ndjson)} bytes).`);

        // --- 4. Submit the job ----------------------------------------------
        const bulkJobRequest: BulkJobRequest = {
            s3_key: s3Key,
            operation: BulkJobRequestOperationEnum.Insert, // default for orders; shown for clarity
            // webhook_url: 'https://example.com/hooks/bulk', // optional one-shot completion POST
        };

        const submitResponse = await bulkApi.bulkSubmitJob({
            object: BulkImportOrders.OBJECT_TYPE,
            bulkJob: bulkJobRequest,
        });
        let job: BulkJob = submitResponse.bulk_job ?? {};
        const jobId = job.job_id;
        if (!jobId) {
            throw new Error('Bulk submit response did not include a job id.');
        }
        console.log(`Submitted job ${jobId} (status=${job.status}).`);

        // --- 5. Poll until terminal -----------------------------------------
        // Bulk endpoints sit behind their own rate-limit bucket, so polling does
        // not consume your normal REST budget — but still poll politely, and bound
        // the loop so it can never hang.
        let polls = 0;
        while (!BulkImportOrders.TERMINAL.includes(job.status ?? '') && polls < BulkImportOrders.MAX_POLLS) {
            await BulkImportOrders.sleep(BulkImportOrders.POLL_INTERVAL_MS);
            const jobResponse = await bulkApi.bulkGetJob({ object: BulkImportOrders.OBJECT_TYPE, jobId });
            job = jobResponse.bulk_job ?? job;
            polls++;
            console.log(`  status=${job.status} processed=${job.processed_records ?? 0}/${job.total_records ?? '?'}`);
        }

        // --- 6. Report ------------------------------------------------------
        console.log(`\nJob ${jobId} finished: ${job.status}`);
        console.log(`  success=${job.success_count} failed=${job.fail_count} duplicate=${job.duplicate_count}`);

        if ((job.fail_count ?? 0) > 0) {
            console.log('\nFailed records:');
            let cursor: string | undefined;
            do {
                const recordsResponse: BulkRecordsResponse = await bulkApi.bulkGetJobRecords({
                    object: BulkImportOrders.OBJECT_TYPE,
                    jobId,
                    status: 'failed',
                    limit: 100,
                    cursor,
                });
                for (const record of recordsResponse.records ?? []) {
                    console.log(`  line ${record.line_number} [${record.merchant_record_id}] ${record.error_code}: ${record.error_message}`);
                }
                cursor = recordsResponse.next_cursor;
            } while (cursor);
        }
    }

    private static sleep(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    /**
     * Raw HTTP PUT of the NDJSON bytes to the presigned S3 URL. This step does NOT
     * go through the SDK — it is a direct upload to S3. Uses Node's built-in https
     * client so the sample type-checks with only @types/node (no DOM lib required).
     */
    private static putBytes(uploadUrl: string, body: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const url = new URL(uploadUrl);
            const payload = Buffer.from(body, 'utf-8');
            const req = https.request(
                {
                    method: 'PUT',
                    hostname: url.hostname,
                    port: url.port || 443,
                    path: `${url.pathname}${url.search}`,
                    headers: {
                        'Content-Type': 'application/x-ndjson',
                        'Content-Length': payload.length,
                    },
                },
                (res) => {
                    const status = res.statusCode ?? 0;
                    res.resume(); // drain so the socket can close
                    if (status >= 200 && status < 300) {
                        resolve();
                    } else {
                        reject(new Error(`Upload PUT failed: ${status} ${res.statusMessage}`));
                    }
                },
            );
            req.on('error', reject);
            req.write(payload);
            req.end();
        });
    }
}
