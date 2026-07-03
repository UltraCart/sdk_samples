package bulk;

import com.google.gson.Gson;
import com.ultracart.admin.v2.BulkApi;
import com.ultracart.admin.v2.models.BulkJob;
import com.ultracart.admin.v2.models.BulkJobRequest;
import com.ultracart.admin.v2.models.BulkJobResponse;
import com.ultracart.admin.v2.models.BulkRecord;
import com.ultracart.admin.v2.models.BulkRecordsResponse;
import com.ultracart.admin.v2.models.BulkUploadUrlResponse;
import common.Constants;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.EnumSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Bulk import orders - end-to-end lifecycle.
 * <p>
 * The bulk API is a throughput multiplier for the per-record REST endpoints: you
 * upload an NDJSON file of records, submit one job, then poll it to completion.
 * <p>
 * Flow demonstrated here:
 * 1. Build an NDJSON payload (one order per line, each with a stable _merchant_record_id).
 * 2. Ask the Bulk API for a presigned S3 upload URL.
 * 3. PUT the NDJSON bytes straight to that URL (this step does NOT go through the SDK).
 * 4. Submit the job. Orders are insert-only; operation defaults to "insert".
 * 5. Poll the job until it reaches a terminal status.
 * 6. Print the counts and list any failed records.
 * <p>
 * For create-or-update semantics, see BulkUpsertCustomers.java (customer upsert).
 */
public class BulkImportOrders {

    private static final String OBJECT_TYPE = "order";

    // The job is done once it reaches one of these; bound the poll so it can't hang.
    private static final EnumSet<BulkJob.StatusEnum> TERMINAL = EnumSet.of(
            BulkJob.StatusEnum.SUCCEEDED,
            BulkJob.StatusEnum.PARTIAL_SUCCESS,
            BulkJob.StatusEnum.FAILED,
            BulkJob.StatusEnum.CANCELLED);

    private static final int MAX_POLLS = 20;
    private static final long POLL_INTERVAL_MS = 3000L;

    public static void execute() throws Exception {

        // Don't use verifySsl=false in production.
        BulkApi bulkApi = new BulkApi(Constants.API_KEY, Constants.VERIFY_SSL_FLAG, Constants.DEBUG_MODE);

        // --- 1. Build the NDJSON payload ---------------------------------------
        // Each line is exactly what POST /rest/v2/order accepts, PLUS a top-level
        // _merchant_record_id - the bulk-surface dedupe key. Use a STABLE value
        // derived from your source system (e.g. the legacy order id), NOT a fresh
        // UUID, so that re-running a fixed file collapses to the original landing
        // instead of re-inserting.
        //
        // NOTE: _merchant_record_id is a bulk-surface field, not an OrderApi model
        // field, so we build each line as a plain Map rather than an SDK model.
        List<Map<String, Object>> orders = new ArrayList<>();

        orders.add(obj(
                "_merchant_record_id", "legacy-order-1029384",
                "merchant_order_id", "ORD-1029384",
                "creation_dts", "2023-11-14T09:22:00Z",
                "currency_code", "USD",
                "total", 79.50,
                "customer_profile", obj("email", "jane@example.com"),
                "items", Arrays.asList(
                        obj("merchant_item_id", "WIDGET-RED",
                                "quantity", 2,
                                "unit_cost", obj("currency_code", "USD", "value", 35.00))),
                "shipping", obj(
                        "ship_to", obj(
                                "first_name", "Jane", "last_name", "Doe", "address1", "123 Main St",
                                "city", "Austin", "state_region", "TX", "postal_code", "78701",
                                "country_code", "US"),
                        "shipping_method", "Standard")));

        orders.add(obj(
                "_merchant_record_id", "legacy-order-1029385",
                "merchant_order_id", "ORD-1029385",
                "creation_dts", "2023-11-15T14:03:00Z",
                "currency_code", "USD",
                "total", 35.00,
                "customer_profile", obj("email", "john@example.com"),
                "items", Arrays.asList(
                        obj("merchant_item_id", "WIDGET-BLUE",
                                "quantity", 1,
                                "unit_cost", obj("currency_code", "USD", "value", 35.00)))));

        // NDJSON = one minified JSON object per line, LF-separated. Do NOT wrap the
        // records in a JSON array and do NOT pretty-print - the worker parses the
        // file line by line. (common.JSON pretty-prints, so use a compact Gson here.)
        Gson gson = new Gson();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < orders.size(); i++) {
            if (i > 0) {
                sb.append('\n');
            }
            sb.append(gson.toJson(orders.get(i)));
        }
        byte[] ndjson = sb.toString().getBytes(StandardCharsets.UTF_8);

        // --- 2. Get a presigned upload URL -------------------------------------
        BulkUploadUrlResponse uploadUrlResponse = bulkApi.bulkGenerateUploadUrl(OBJECT_TYPE);
        String uploadUrl = uploadUrlResponse.getUploadUrl();
        String s3Key = uploadUrlResponse.getS3Key();
        System.out.println("Upload URL issued (s3_key=" + s3Key
                + ", max_records=" + uploadUrlResponse.getMaxRecords() + ").");

        // --- 3. Upload the NDJSON straight to the presigned URL ----------------
        // A plain HTTP PUT to S3 - this does NOT go through the SDK.
        uploadToS3(uploadUrl, ndjson);
        System.out.println("Uploaded " + orders.size() + " records (" + ndjson.length + " bytes).");

        // --- 4. Submit the job -------------------------------------------------
        BulkJobRequest request = new BulkJobRequest();
        request.setS3Key(s3Key);
        request.setOperation(BulkJobRequest.OperationEnum.INSERT); // default for orders; shown for clarity
        // request.setWebhookUrl("https://example.com/hooks/bulk"); // optional one-shot completion POST

        BulkJobResponse submitResponse = bulkApi.bulkSubmitJob(OBJECT_TYPE, request);
        BulkJob job = submitResponse.getBulkJob();
        String jobId = job.getJobId();
        System.out.println("Submitted job " + jobId + " (status=" + job.getStatus() + ").");

        // --- 5. Poll until terminal --------------------------------------------
        // Bulk endpoints sit behind their own rate-limit bucket, so polling does not
        // consume your normal REST budget - but still poll politely and bound it.
        for (int poll = 0; poll < MAX_POLLS && !TERMINAL.contains(job.getStatus()); poll++) {
            Thread.sleep(POLL_INTERVAL_MS);
            job = bulkApi.bulkGetJob(OBJECT_TYPE, jobId).getBulkJob();
            System.out.println("  status=" + job.getStatus()
                    + " processed=" + nz(job.getProcessedRecords()) + "/" + nz(job.getTotalRecords()));
        }

        if (!TERMINAL.contains(job.getStatus())) {
            System.out.println("Gave up polling after " + MAX_POLLS + " tries; job " + jobId
                    + " still " + job.getStatus() + ".");
            return;
        }

        // --- 6. Report ---------------------------------------------------------
        System.out.println("\nJob " + jobId + " finished: " + job.getStatus());
        System.out.println("  success=" + nz(job.getSuccessCount())
                + " failed=" + nz(job.getFailCount())
                + " duplicate=" + nz(job.getDuplicateCount()));

        if (job.getFailCount() != null && job.getFailCount() > 0) {
            System.out.println("\nFailed records:");
            String cursor = null;
            do {
                BulkRecordsResponse recordsResponse =
                        bulkApi.bulkGetJobRecords(OBJECT_TYPE, jobId, "failed", cursor, 100);
                for (BulkRecord record : recordsResponse.getRecords()) {
                    System.out.println("  line " + record.getLineNumber()
                            + " [" + record.getMerchantRecordId() + "] "
                            + record.getErrorCode() + ": " + record.getErrorMessage());
                }
                cursor = recordsResponse.getNextCursor();
            } while (cursor != null);
        }
    }

    /**
     * Raw HTTP PUT of the NDJSON bytes to the presigned URL. Uses HttpURLConnection
     * so the sample compiles on Java 8 (no dependency on java.net.http).
     */
    private static void uploadToS3(String uploadUrl, byte[] body) throws Exception {
        HttpURLConnection conn = (HttpURLConnection) new URL(uploadUrl).openConnection();
        try {
            conn.setDoOutput(true);
            conn.setRequestMethod("PUT");
            conn.setRequestProperty("Content-Type", "application/x-ndjson");
            conn.setFixedLengthStreamingMode(body.length);
            try (OutputStream os = conn.getOutputStream()) {
                os.write(body);
            }
            int status = conn.getResponseCode();
            if (status < 200 || status >= 300) {
                throw new RuntimeException("Upload PUT failed: " + status + " " + conn.getResponseMessage());
            }
        } finally {
            conn.disconnect();
        }
    }

    /** Build an ordered Map from alternating key/value arguments. */
    private static Map<String, Object> obj(Object... kv) {
        Map<String, Object> m = new LinkedHashMap<>();
        for (int i = 0; i < kv.length; i += 2) {
            m.put((String) kv[i], kv[i + 1]);
        }
        return m;
    }

    /** null-safe integer for display. */
    private static int nz(Integer value) {
        return value == null ? 0 : value;
    }
}
