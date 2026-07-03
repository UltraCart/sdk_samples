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
// For create-or-update semantics, see BulkUpsertCustomers.cs (customer upsert).

using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Client;
using com.ultracart.admin.v2.Model;
using Newtonsoft.Json;

namespace SdkSample.bulk
{
    // ReSharper disable once ClassNeverInstantiated.Global
    public class BulkImportOrders
    {
        private const string ObjectType = "order";

        // Terminal job statuses — poll until the job reports one of these. Status is a
        // generated enum on the SDK model (Partialsuccess == the wire's "partial_success").
        private static readonly BulkJob.StatusEnum[] TerminalStatuses =
        {
            BulkJob.StatusEnum.Succeeded,
            BulkJob.StatusEnum.Partialsuccess,
            BulkJob.StatusEnum.Failed,
            BulkJob.StatusEnum.Cancelled
        };

        // The S3 upload is a raw HTTP PUT, so it does not go through the SDK.
        private static readonly HttpClient HttpClient = new HttpClient();

        public static void Execute()
        {
            try
            {
                RunBulkImport();
            }
            catch (ApiException e)
            {
                Console.WriteLine("An ApiException occurred.  Please review the following error:");
                Console.WriteLine(e); // <-- change_me: handle gracefully
                Environment.Exit(1);
            }
        }

        private static void RunBulkImport()
        {
            BulkApi bulkApi = Samples.GetBulkApi();

            // --- 1. Build the NDJSON payload -----------------------------------------
            // Each line is exactly what POST /rest/v2/order accepts, PLUS a top-level
            // _merchant_record_id — the bulk-surface dedupe key. Use a STABLE value derived
            // from your source system (e.g. the legacy order id), NOT a fresh UUID, so that
            // re-running a fixed file collapses to the original landing instead of re-inserting.
            //
            // Build the lines as plain objects (anonymous types here), NOT SDK models: the
            // _merchant_record_id marker is a bulk-surface field, not part of the order model.
            var orders = new List<object>
            {
                new
                {
                    _merchant_record_id = "legacy-order-1029384",
                    merchant_order_id = "ORD-1029384",
                    creation_dts = "2023-11-14T09:22:00Z",
                    currency_code = "USD",
                    total = 79.50,
                    customer_profile = new { email = "jane@example.com" },
                    items = new[]
                    {
                        new { merchant_item_id = "WIDGET-RED", quantity = 2, unit_cost = new { currency_code = "USD", value = 35.00 } }
                    },
                    shipping = new
                    {
                        ship_to = new
                        {
                            first_name = "Jane", last_name = "Doe", address1 = "123 Main St",
                            city = "Austin", state_region = "TX", postal_code = "78701", country_code = "US"
                        },
                        shipping_method = "Standard"
                    }
                },
                new
                {
                    _merchant_record_id = "legacy-order-1029385",
                    merchant_order_id = "ORD-1029385",
                    creation_dts = "2023-11-15T14:03:00Z",
                    currency_code = "USD",
                    total = 35.00,
                    customer_profile = new { email = "john@example.com" },
                    items = new[]
                    {
                        new { merchant_item_id = "WIDGET-BLUE", quantity = 1, unit_cost = new { currency_code = "USD", value = 35.00 } }
                    }
                }
            };

            // NDJSON = one minified JSON object per line, LF-separated. Do NOT wrap the records
            // in a JSON array and do NOT pretty-print — the worker parses the file line by line.
            var lines = new List<string>();
            foreach (var order in orders)
            {
                lines.Add(JsonConvert.SerializeObject(order));
            }
            string ndjson = string.Join("\n", lines);
            byte[] payloadBytes = Encoding.UTF8.GetBytes(ndjson);

            // --- 2. Get a presigned upload URL ---------------------------------------
            BulkUploadUrlResponse uploadUrlResponse = bulkApi.BulkGenerateUploadUrl(ObjectType);
            string uploadUrl = uploadUrlResponse.UploadUrl;
            string s3Key = uploadUrlResponse.S3Key;
            Console.WriteLine($"Upload URL issued (s3_key={s3Key}, max_records={uploadUrlResponse.MaxRecords}).");

            // --- 3. Upload the NDJSON straight to the presigned URL ------------------
            // A plain HTTP PUT to S3, using the framework HttpClient rather than the SDK.
            var content = new ByteArrayContent(payloadBytes);
            content.Headers.ContentType = new MediaTypeHeaderValue("application/x-ndjson");
            HttpResponseMessage putResponse = HttpClient.PutAsync(uploadUrl, content).GetAwaiter().GetResult();
            if (!putResponse.IsSuccessStatusCode)
            {
                throw new Exception($"Upload PUT failed: {(int)putResponse.StatusCode} {putResponse.ReasonPhrase}");
            }
            Console.WriteLine($"Uploaded {orders.Count} records ({payloadBytes.Length} bytes).");

            // --- 4. Submit the job --------------------------------------------------
            var request = new BulkJobRequest
            {
                S3Key = s3Key,
                Operation = BulkJobRequest.OperationEnum.Insert // default for orders; shown here for clarity
                // WebhookUrl = "https://example.com/hooks/bulk" // optional one-shot completion POST
            };

            BulkJobResponse submitResponse = bulkApi.BulkSubmitJob(ObjectType, request);
            BulkJob job = submitResponse.BulkJob;
            string jobId = job.JobId;
            Console.WriteLine($"Submitted job {jobId} (status={job.Status}).");

            // --- 5. Poll until terminal (bounded so it can't hang) ------------------
            job = PollUntilTerminal(bulkApi, jobId, job);

            // --- 6. Report ----------------------------------------------------------
            Console.WriteLine($"\nJob {jobId} finished: {job.Status}");
            Console.WriteLine($"  success={job.SuccessCount} failed={job.FailCount} duplicate={job.DuplicateCount}");

            if (job.FailCount > 0)
            {
                Console.WriteLine("\nFailed records:");
                string cursor = null;
                do
                {
                    BulkRecordsResponse recordsResponse = bulkApi.BulkGetJobRecords(ObjectType, jobId, "failed", cursor, 100);
                    foreach (BulkRecord record in recordsResponse.Records)
                    {
                        Console.WriteLine($"  line {record.LineNumber} [{record.MerchantRecordId}] {record.ErrorCode}: {record.ErrorMessage}");
                    }
                    cursor = recordsResponse.NextCursor;
                } while (!string.IsNullOrEmpty(cursor));
            }
        }

        // Poll the job until it reaches a terminal status. Bulk endpoints sit behind their own
        // rate-limit bucket, so polling does not consume your normal REST budget — but still poll
        // politely, and bound the loop (~20 tries) so a stuck job can't hang the sample.
        private static BulkJob PollUntilTerminal(BulkApi bulkApi, string jobId, BulkJob job)
        {
            const int maxTries = 20;
            for (int i = 0; i < maxTries && !IsTerminal(job.Status); i++)
            {
                Thread.Sleep(3000);
                job = bulkApi.BulkGetJob(ObjectType, jobId).BulkJob;
                Console.WriteLine($"  status={job.Status} processed={job.ProcessedRecords}/{job.TotalRecords}");
            }
            return job;
        }

        private static bool IsTerminal(BulkJob.StatusEnum? status)
        {
            return status.HasValue && Array.IndexOf(TerminalStatuses, status.Value) >= 0;
        }

        // C# projects allow a single Main entry point, which already lives in EntryPoint.cs.
        // To run just this sample standalone, comment out EntryPoint.Main and uncomment:
        //
        // public static void Main(string[] args)
        // {
        //     Execute();
        // }
    }
}
