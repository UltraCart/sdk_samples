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
 * Bulk upsert customers - end-to-end lifecycle with operation="upsert".
 * <p>
 * "upsert" creates a customer when none is found and otherwise replaces the
 * existing one (a full-record replace, identical to PUT /rest/v2/customer - a
 * field you omit is cleared, it is not a partial merge). Upsert is customer-only
 * in v1; submitting operation="upsert" to /rest/v2/bulk/order is a 400.
 * <p>
 * Identity resolution per line:
 * 1. The _merchant_record_id marker from a prior landing wins (that customer is updated).
 * 2. No marker -> resolve by the line's email; still no match -> insert.
 * On success each record reports action="inserted" or action="updated".
 * <p>
 * See BulkImportOrders.java for the fully-commented base flow; this sample
 * highlights only what differs for upsert.
 */
public class BulkUpsertCustomers {

    private static final String OBJECT_TYPE = "customer";

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

        // Each line is what the per-record customer-create endpoint accepts, plus the
        // top-level _merchant_record_id. When email is your natural key, using it as
        // the _merchant_record_id makes the bulk dedupe and UC's email-uniqueness
        // agree. Build each line as a plain Map (not an SDK model) so the bulk-only
        // _merchant_record_id field rides along.
        List<Map<String, Object>> customers = new ArrayList<>();

        customers.add(obj(
                "_merchant_record_id", "jane@example.com",
                "email", "jane@example.com",
                "first_name", "Jane",
                "last_name", "Doe",
                "billing", Arrays.asList(
                        obj("first_name", "Jane", "last_name", "Doe", "address1", "123 Main St",
                                "city", "Austin", "state_region", "TX", "postal_code", "78701",
                                "country_code", "US", "default_billing", true)),
                "tags", Arrays.asList("legacy-import")));

        customers.add(obj(
                "_merchant_record_id", "john@example.com",
                "email", "john@example.com",
                "first_name", "John",
                "last_name", "Smith"));

        // NDJSON: one minified JSON object per line, LF-separated, no array wrapper.
        // (common.JSON pretty-prints, so use a compact Gson here.)
        Gson gson = new Gson();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < customers.size(); i++) {
            if (i > 0) {
                sb.append('\n');
            }
            sb.append(gson.toJson(customers.get(i)));
        }
        byte[] ndjson = sb.toString().getBytes(StandardCharsets.UTF_8);

        BulkUploadUrlResponse uploadUrlResponse = bulkApi.bulkGenerateUploadUrl(OBJECT_TYPE);
        String uploadUrl = uploadUrlResponse.getUploadUrl();
        String s3Key = uploadUrlResponse.getS3Key();
        System.out.println("Upload URL issued (s3_key=" + s3Key + ").");

        uploadToS3(uploadUrl, ndjson);
        System.out.println("Uploaded " + customers.size() + " customers.");

        // The only submit difference vs. insert: operation = "upsert".
        BulkJobRequest request = new BulkJobRequest();
        request.setS3Key(s3Key);
        request.setOperation(BulkJobRequest.OperationEnum.UPSERT);

        BulkJobResponse submitResponse = bulkApi.bulkSubmitJob(OBJECT_TYPE, request);
        BulkJob job = submitResponse.getBulkJob();
        String jobId = job.getJobId();
        System.out.println("Submitted upsert job " + jobId + " (operation=" + job.getOperation() + ").");

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

        System.out.println("\nJob " + jobId + " finished: " + job.getStatus());
        System.out.println("  success=" + nz(job.getSuccessCount())
                + " failed=" + nz(job.getFailCount())
                + " duplicate=" + nz(job.getDuplicateCount()));

        // On upsert, each successful record tells you whether it created or replaced
        // a customer via the "action" field (inserted | updated).
        System.out.println("\nPer-record actions:");
        String cursor = null;
        do {
            BulkRecordsResponse recordsResponse =
                    bulkApi.bulkGetJobRecords(OBJECT_TYPE, jobId, "success", cursor, 100);
            for (BulkRecord record : recordsResponse.getRecords()) {
                System.out.println("  [" + record.getMerchantRecordId() + "] "
                        + record.getAction() + " -> uc_id=" + record.getUcId());
            }
            cursor = recordsResponse.getNextCursor();
        } while (cursor != null);

        if (job.getFailCount() != null && job.getFailCount() > 0) {
            System.out.println("\nFailed records (an email_conflict means the line's email belongs to a "
                    + "different customer than the marker resolved to):");
            cursor = null;
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
