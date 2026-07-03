<?php

/*
 * Bulk import orders — end-to-end lifecycle.
 *
 * The bulk API is a throughput multiplier for the per-record REST endpoints: you
 * upload an NDJSON file of records, submit one job, then poll it to completion.
 *
 * Flow demonstrated here:
 *   1. Build an NDJSON payload (one order per line, each with a stable _merchant_record_id).
 *   2. Ask the Bulk API for a presigned S3 upload URL.
 *   3. PUT the NDJSON bytes straight to that URL (this step does NOT go through the SDK).
 *   4. Submit the job. Orders are insert-only; operation defaults to "insert".
 *   5. Poll the job until it reaches a terminal status.
 *   6. Print the counts and list any failed records.
 *
 * For create-or-update semantics, see bulkUpsertCustomers.php (customer upsert).
 *
 * This example is written for our run_samples.sh harness, so it prints plain
 * human-readable text rather than HTML.
 */

use ultracart\v2\ApiException;
use ultracart\v2\models\BulkJobRequest;

require_once '../vendor/autoload.php';
require_once '../samples.php';

const OBJECT_TYPE = 'order';

// Terminal job statuses — polling stops once the job reaches any of these.
const TERMINAL_STATUSES = ['succeeded', 'partial_success', 'failed', 'cancelled'];

// Bound the poll so a stuck job can't hang the sample.
const MAX_POLL_ATTEMPTS = 20;
const POLL_SLEEP_SECONDS = 3;

/**
 * Raw HTTP PUT of the NDJSON bytes to the presigned S3 URL. This deliberately
 * bypasses the SDK — the upload target is plain S3, not an UltraCart endpoint.
 *
 * @throws RuntimeException on a non-2xx response
 */
function putNdjson(string $upload_url, string $ndjson): void
{
    $ch = curl_init($upload_url);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
    curl_setopt($ch, CURLOPT_POSTFIELDS, $ndjson);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/x-ndjson']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, Constants::VERIFY_SSL);
    $body = curl_exec($ch);
    if ($body === false) {
        $err = curl_error($ch);
        curl_close($ch);
        throw new RuntimeException("Upload PUT failed: $err");
    }
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($status < 200 || $status >= 300) {
        throw new RuntimeException("Upload PUT failed: HTTP $status");
    }
}

try {

    $bulk_api = Samples::getBulkApi();

    // --- 1. Build the NDJSON payload ----------------------------------------
    // Each line is exactly what POST /rest/v2/order accepts, PLUS a top-level
    // _merchant_record_id — the bulk-surface dedupe key. Use a STABLE value derived
    // from your source system (e.g. the legacy order id), NOT a fresh UUID, so that
    // re-running a fixed file collapses to the original landing instead of re-inserting.
    //
    // NOTE: build the lines as PLAIN associative arrays, not SDK model instances —
    // _merchant_record_id is not an SDK model field, and json_encode of a model would
    // drop unknown keys and rename the rest.
    $orders = [
        [
            '_merchant_record_id' => 'legacy-order-1029384',
            'merchant_order_id' => 'ORD-1029384',
            'creation_dts' => '2023-11-14T09:22:00Z',
            'currency_code' => 'USD',
            'total' => 79.50,
            'customer_profile' => ['email' => 'jane@example.com'],
            'items' => [
                ['merchant_item_id' => 'WIDGET-RED', 'quantity' => 2, 'unit_cost' => ['currency_code' => 'USD', 'value' => 35.00]],
            ],
            'shipping' => [
                'ship_to' => [
                    'first_name' => 'Jane', 'last_name' => 'Doe', 'address1' => '123 Main St',
                    'city' => 'Austin', 'state_region' => 'TX', 'postal_code' => '78701', 'country_code' => 'US',
                ],
                'shipping_method' => 'Standard',
            ],
        ],
        [
            '_merchant_record_id' => 'legacy-order-1029385',
            'merchant_order_id' => 'ORD-1029385',
            'creation_dts' => '2023-11-15T14:03:00Z',
            'currency_code' => 'USD',
            'total' => 35.00,
            'customer_profile' => ['email' => 'john@example.com'],
            'items' => [
                ['merchant_item_id' => 'WIDGET-BLUE', 'quantity' => 1, 'unit_cost' => ['currency_code' => 'USD', 'value' => 35.00]],
            ],
        ],
    ];

    // NDJSON = one minified JSON object per line, LF-separated. Do NOT wrap the records
    // in a JSON array and do NOT pretty-print — the worker parses the file line by line.
    $lines = array_map(
        static fn(array $order): string => json_encode($order, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
        $orders
    );
    $ndjson = implode("\n", $lines);

    // --- 2. Get a presigned upload URL --------------------------------------
    $upload_url_response = $bulk_api->bulkGenerateUploadUrl(OBJECT_TYPE);
    $upload_url = $upload_url_response->getUploadUrl();
    $s3_key = $upload_url_response->getS3Key();
    echo 'Upload URL issued (s3_key=' . $s3_key . ', max_records=' . $upload_url_response->getMaxRecords() . ").\n";

    // --- 3. Upload the NDJSON straight to the presigned URL -----------------
    putNdjson($upload_url, $ndjson);
    echo 'Uploaded ' . count($orders) . ' records (' . strlen($ndjson) . " bytes).\n";

    // --- 4. Submit the job --------------------------------------------------
    $request = new BulkJobRequest();
    $request->setS3Key($s3_key);
    $request->setOperation('insert'); // default for orders; shown here for clarity
    // $request->setWebhookUrl('https://example.com/hooks/bulk'); // optional one-shot completion POST

    $submit_response = $bulk_api->bulkSubmitJob(OBJECT_TYPE, $request);
    $job = $submit_response->getBulkJob();
    $job_id = $job->getJobId();
    echo 'Submitted job ' . $job_id . ' (status=' . $job->getStatus() . ").\n";

    // --- 5. Poll until terminal ---------------------------------------------
    // Bulk endpoints sit behind their own rate-limit bucket, so polling does not
    // consume your normal REST budget — but still poll politely and bound the loop.
    $attempts = 0;
    while (!in_array($job->getStatus(), TERMINAL_STATUSES, true) && $attempts < MAX_POLL_ATTEMPTS) {
        sleep(POLL_SLEEP_SECONDS);
        $attempts++;
        $job = $bulk_api->bulkGetJob(OBJECT_TYPE, $job_id)->getBulkJob();
        echo '  status=' . $job->getStatus()
            . ' processed=' . ($job->getProcessedRecords() ?? 0)
            . '/' . ($job->getTotalRecords() ?? '?') . "\n";
    }

    // --- 6. Report ----------------------------------------------------------
    echo "\nJob " . $job_id . ' finished: ' . $job->getStatus() . "\n";
    echo '  success=' . $job->getSuccessCount()
        . ' failed=' . $job->getFailCount()
        . ' duplicate=' . $job->getDuplicateCount() . "\n";

    if ($job->getFailCount() > 0) {
        echo "\nFailed records:\n";
        $cursor = null;
        do {
            $records_response = $bulk_api->bulkGetJobRecords(OBJECT_TYPE, $job_id, 'failed', $cursor, 100);
            foreach ($records_response->getRecords() as $record) {
                echo '  line ' . $record->getLineNumber()
                    . ' [' . $record->getMerchantRecordId() . '] '
                    . $record->getErrorCode() . ': ' . $record->getErrorMessage() . "\n";
            }
            $cursor = $records_response->getNextCursor();
        } while ($cursor);
    }

} catch (ApiException $e) {
    // SDK errors carry the HTTP response body — the analog of the JS error.response.text.
    echo 'Bulk import failed: ' . $e->getResponseBody() . "\n";
    die(1);
} catch (RuntimeException $e) {
    echo 'Bulk import failed: ' . $e->getMessage() . "\n";
    die(1);
}
