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
// See BulkImportOrders.ts for the fully-commented base flow; this sample
// highlights only what differs for upsert.

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
export class BulkUpsertCustomers {
    private static readonly OBJECT_TYPE = 'customer';

    private static readonly TERMINAL = ['succeeded', 'partial_success', 'failed', 'cancelled'];
    private static readonly MAX_POLLS = 20;
    private static readonly POLL_INTERVAL_MS = 3000;

    public static async execute(): Promise<void> {
        // Each line is what the per-record customer-create endpoint accepts, plus
        // the top-level _merchant_record_id. When email is your natural key, using
        // it as the _merchant_record_id makes the bulk dedupe and UC's
        // email-uniqueness agree. These are PLAIN objects, not SDK model instances.
        const customers: Array<Record<string, unknown>> = [
            {
                _merchant_record_id: 'jane@example.com',
                email: 'jane@example.com',
                first_name: 'Jane',
                last_name: 'Doe',
                billing: [{
                    first_name: 'Jane', last_name: 'Doe', address1: '123 Main St',
                    city: 'Austin', state_region: 'TX', postal_code: '78701', country_code: 'US', default_billing: true,
                }],
                tags: ['legacy-import'],
            },
            {
                _merchant_record_id: 'john@example.com',
                email: 'john@example.com',
                first_name: 'John',
                last_name: 'Smith',
            },
        ];

        const ndjson = customers.map((customer) => JSON.stringify(customer)).join('\n');

        const uploadUrlResponse = await bulkApi.bulkGenerateUploadUrl({ object: BulkUpsertCustomers.OBJECT_TYPE });
        const uploadUrl = uploadUrlResponse.upload_url;
        const s3Key = uploadUrlResponse.s3_key;
        if (!uploadUrl || !s3Key) {
            throw new Error('Bulk upload-url response did not include upload_url / s3_key.');
        }
        console.log(`Upload URL issued (s3_key=${s3Key}).`);

        await BulkUpsertCustomers.putBytes(uploadUrl, ndjson);
        console.log(`Uploaded ${customers.length} customers.`);

        // The only submit difference vs. insert: operation = "upsert".
        const bulkJobRequest: BulkJobRequest = {
            s3_key: s3Key,
            operation: BulkJobRequestOperationEnum.Upsert,
        };

        const submitResponse = await bulkApi.bulkSubmitJob({
            object: BulkUpsertCustomers.OBJECT_TYPE,
            bulkJob: bulkJobRequest,
        });
        let job: BulkJob = submitResponse.bulk_job ?? {};
        const jobId = job.job_id;
        if (!jobId) {
            throw new Error('Bulk submit response did not include a job id.');
        }
        console.log(`Submitted upsert job ${jobId} (operation=${job.operation}).`);

        let polls = 0;
        while (!BulkUpsertCustomers.TERMINAL.includes(job.status ?? '') && polls < BulkUpsertCustomers.MAX_POLLS) {
            await BulkUpsertCustomers.sleep(BulkUpsertCustomers.POLL_INTERVAL_MS);
            const jobResponse = await bulkApi.bulkGetJob({ object: BulkUpsertCustomers.OBJECT_TYPE, jobId });
            job = jobResponse.bulk_job ?? job;
            polls++;
            console.log(`  status=${job.status} processed=${job.processed_records ?? 0}/${job.total_records ?? '?'}`);
        }

        console.log(`\nJob ${jobId} finished: ${job.status}`);
        console.log(`  success=${job.success_count} failed=${job.fail_count} duplicate=${job.duplicate_count}`);

        // On upsert, each successful record tells you whether it created or replaced
        // a customer via the "action" field (inserted | updated).
        console.log('\nPer-record actions:');
        let cursor: string | undefined;
        do {
            const recordsResponse: BulkRecordsResponse = await bulkApi.bulkGetJobRecords({
                object: BulkUpsertCustomers.OBJECT_TYPE,
                jobId,
                status: 'success',
                limit: 100,
                cursor,
            });
            for (const record of recordsResponse.records ?? []) {
                console.log(`  [${record.merchant_record_id}] ${record.action} -> uc_id=${record.uc_id}`);
            }
            cursor = recordsResponse.next_cursor;
        } while (cursor);

        if ((job.fail_count ?? 0) > 0) {
            console.log('\nFailed records (an email_conflict means the line\'s email belongs to a different customer than the marker resolved to):');
            cursor = undefined;
            do {
                const recordsResponse: BulkRecordsResponse = await bulkApi.bulkGetJobRecords({
                    object: BulkUpsertCustomers.OBJECT_TYPE,
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
