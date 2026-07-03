<?php

/*
 * Bulk upsert customers — end-to-end lifecycle with operation="upsert".
 *
 * "upsert" creates a customer when none is found and otherwise replaces the
 * existing one (a full-record replace, identical to PUT /rest/v2/customer — a
 * field you omit is cleared, it is not a partial merge). Upsert is customer-only
 * in v1; submitting operation="upsert" to /rest/v2/bulk/order is a 400.
 *
 * Identity resolution per line:
 *   1. The _merchant_record_id marker from a prior landing wins (that customer is updated).
 *   2. No marker -> resolve by the line's email; still no match -> insert.
 * On success each record reports action="inserted" or action="updated".
 *
 * See bulkImportOrders.php for the fully-commented base flow; this sample highlights
 * only what differs for upsert.
 */

use ultracart\v2\ApiException;
use ultracart\v2\models\BulkJobRequest;

require_once '../vendor/autoload.php';
require_once '../samples.php';

const OBJECT_TYPE = 'customer';

const TERMINAL_STATUSES = ['succeeded', 'partial_success', 'failed', 'cancelled'];
const MAX_POLL_ATTEMPTS = 20;
const POLL_SLEEP_SECONDS = 3;

/**
 * Raw HTTP PUT of the NDJSON bytes to the presigned S3 URL — bypasses the SDK.
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

    // Each line is what the per-record customer-create endpoint accepts, plus the
    // top-level _merchant_record_id. When email is your natural key, using it as the
    // _merchant_record_id makes the bulk dedupe and UC's email-uniqueness agree.
    // Build PLAIN associative arrays, not SDK model instances.
    $customers = [
        [
            '_merchant_record_id' => 'jane@example.com',
            'email' => 'jane@example.com',
            'first_name' => 'Jane',
            'last_name' => 'Doe',
            'billing' => [[
                'first_name' => 'Jane', 'last_name' => 'Doe', 'address1' => '123 Main St',
                'city' => 'Austin', 'state_region' => 'TX', 'postal_code' => '78701',
                'country_code' => 'US', 'default_billing' => true,
            ]],
            'tags' => ['legacy-import'],
        ],
        [
            '_merchant_record_id' => 'john@example.com',
            'email' => 'john@example.com',
            'first_name' => 'John',
            'last_name' => 'Smith',
        ],
    ];

    $lines = array_map(
        static fn(array $customer): string => json_encode($customer, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
        $customers
    );
    $ndjson = implode("\n", $lines);

    $upload_url_response = $bulk_api->bulkGenerateUploadUrl(OBJECT_TYPE);
    $upload_url = $upload_url_response->getUploadUrl();
    $s3_key = $upload_url_response->getS3Key();
    echo 'Upload URL issued (s3_key=' . $s3_key . ").\n";

    putNdjson($upload_url, $ndjson);
    echo 'Uploaded ' . count($customers) . " customers.\n";

    // The only submit difference vs. insert: operation = "upsert".
    $request = new BulkJobRequest();
    $request->setS3Key($s3_key);
    $request->setOperation('upsert');

    $submit_response = $bulk_api->bulkSubmitJob(OBJECT_TYPE, $request);
    $job = $submit_response->getBulkJob();
    $job_id = $job->getJobId();
    echo 'Submitted upsert job ' . $job_id . ' (operation=' . $job->getOperation() . ").\n";

    $attempts = 0;
    while (!in_array($job->getStatus(), TERMINAL_STATUSES, true) && $attempts < MAX_POLL_ATTEMPTS) {
        sleep(POLL_SLEEP_SECONDS);
        $attempts++;
        $job = $bulk_api->bulkGetJob(OBJECT_TYPE, $job_id)->getBulkJob();
        echo '  status=' . $job->getStatus()
            . ' processed=' . ($job->getProcessedRecords() ?? 0)
            . '/' . ($job->getTotalRecords() ?? '?') . "\n";
    }

    echo "\nJob " . $job_id . ' finished: ' . $job->getStatus() . "\n";
    echo '  success=' . $job->getSuccessCount()
        . ' failed=' . $job->getFailCount()
        . ' duplicate=' . $job->getDuplicateCount() . "\n";

    // On upsert, each successful record tells you whether it created or replaced a
    // customer via the "action" field (inserted | updated).
    echo "\nPer-record actions:\n";
    $cursor = null;
    do {
        $records_response = $bulk_api->bulkGetJobRecords(OBJECT_TYPE, $job_id, 'success', $cursor, 100);
        foreach ($records_response->getRecords() as $record) {
            echo '  [' . $record->getMerchantRecordId() . '] '
                . $record->getAction() . ' -> uc_id=' . $record->getUcId() . "\n";
        }
        $cursor = $records_response->getNextCursor();
    } while ($cursor);

    if ($job->getFailCount() > 0) {
        echo "\nFailed records (an email_conflict means the line's email belongs to a different customer than the marker resolved to):\n";
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
    echo 'Bulk upsert failed: ' . $e->getResponseBody() . "\n";
    die(1);
} catch (RuntimeException $e) {
    echo 'Bulk upsert failed: ' . $e->getMessage() . "\n";
    die(1);
}
