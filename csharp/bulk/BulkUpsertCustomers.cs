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
// See BulkImportOrders.cs for the fully-commented base flow; this sample highlights
// only what differs for upsert.

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
    public class BulkUpsertCustomers
    {
        private const string ObjectType = "customer";

        // Status is a generated enum on the SDK model (Partialsuccess == wire "partial_success").
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
                RunBulkUpsert();
            }
            catch (ApiException e)
            {
                Console.WriteLine("An ApiException occurred.  Please review the following error:");
                Console.WriteLine(e); // <-- change_me: handle gracefully
                Environment.Exit(1);
            }
        }

        private static void RunBulkUpsert()
        {
            BulkApi bulkApi = Samples.GetBulkApi();

            // Each line is what the per-record customer-create endpoint accepts, plus the
            // top-level _merchant_record_id. When email is your natural key, using it as the
            // _merchant_record_id makes the bulk dedupe and UC's email-uniqueness agree.
            // Build the lines as plain objects (anonymous types), NOT SDK models.
            var customers = new List<object>
            {
                new
                {
                    _merchant_record_id = "jane@example.com",
                    email = "jane@example.com",
                    first_name = "Jane",
                    last_name = "Doe",
                    billing = new[]
                    {
                        new
                        {
                            first_name = "Jane", last_name = "Doe", address1 = "123 Main St",
                            city = "Austin", state_region = "TX", postal_code = "78701",
                            country_code = "US", default_billing = true
                        }
                    },
                    tags = new[] { "legacy-import" }
                },
                new
                {
                    _merchant_record_id = "john@example.com",
                    email = "john@example.com",
                    first_name = "John",
                    last_name = "Smith"
                }
            };

            var lines = new List<string>();
            foreach (var customer in customers)
            {
                lines.Add(JsonConvert.SerializeObject(customer));
            }
            string ndjson = string.Join("\n", lines);
            byte[] payloadBytes = Encoding.UTF8.GetBytes(ndjson);

            BulkUploadUrlResponse uploadUrlResponse = bulkApi.BulkGenerateUploadUrl(ObjectType);
            string uploadUrl = uploadUrlResponse.UploadUrl;
            string s3Key = uploadUrlResponse.S3Key;
            Console.WriteLine($"Upload URL issued (s3_key={s3Key}).");

            var content = new ByteArrayContent(payloadBytes);
            content.Headers.ContentType = new MediaTypeHeaderValue("application/x-ndjson");
            HttpResponseMessage putResponse = HttpClient.PutAsync(uploadUrl, content).GetAwaiter().GetResult();
            if (!putResponse.IsSuccessStatusCode)
            {
                throw new Exception($"Upload PUT failed: {(int)putResponse.StatusCode} {putResponse.ReasonPhrase}");
            }
            Console.WriteLine($"Uploaded {customers.Count} customers.");

            // The only submit difference vs. insert: operation = "upsert".
            var request = new BulkJobRequest
            {
                S3Key = s3Key,
                Operation = BulkJobRequest.OperationEnum.Upsert
            };

            BulkJobResponse submitResponse = bulkApi.BulkSubmitJob(ObjectType, request);
            BulkJob job = submitResponse.BulkJob;
            string jobId = job.JobId;
            Console.WriteLine($"Submitted upsert job {jobId} (operation={job.Operation}).");

            job = PollUntilTerminal(bulkApi, jobId, job);

            Console.WriteLine($"\nJob {jobId} finished: {job.Status}");
            Console.WriteLine($"  success={job.SuccessCount} failed={job.FailCount} duplicate={job.DuplicateCount}");

            // On upsert, each successful record tells you whether it created or replaced a
            // customer via the "action" field (inserted | updated).
            Console.WriteLine("\nPer-record actions:");
            string cursor = null;
            do
            {
                BulkRecordsResponse recordsResponse = bulkApi.BulkGetJobRecords(ObjectType, jobId, "success", cursor, 100);
                foreach (BulkRecord record in recordsResponse.Records)
                {
                    Console.WriteLine($"  [{record.MerchantRecordId}] {record.Action} -> uc_id={record.UcId}");
                }
                cursor = recordsResponse.NextCursor;
            } while (!string.IsNullOrEmpty(cursor));

            if (job.FailCount > 0)
            {
                Console.WriteLine("\nFailed records (an email_conflict means the line's email belongs to a different customer than the marker resolved to):");
                cursor = null;
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

        // Poll the job until it reaches a terminal status, bounded (~20 tries) so a stuck job
        // can't hang the sample. Bulk polling uses its own rate-limit bucket.
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
