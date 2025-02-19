using System;
using System.Collections.Generic;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Client;
using com.ultracart.admin.v2.Model;

namespace SdkSample.webhook
{
    public class GetWebhookLogSummaries
    {
        /*
         * This example illustrates how to retrieve webhook log summaries.
         */

        /// <summary>
        /// Gets a chunk of webhook log summaries
        /// </summary>
        /// <param name="webhookApi">The webhook API instance</param>
        /// <param name="offset">Offset for pagination</param>
        /// <param name="limit">Maximum number of records to return</param>
        /// <returns>Array of webhook log summaries</returns>
        /// <exception cref="ApiException">Thrown when API call fails</exception>
        private static List<WebhookLogSummary> GetSummaryChunk(WebhookApi webhookApi, int offset, int limit)
        {
            int webhookOid = 123456789; // if you don't know this, use getWebhooks to find your webhook, then get its oid.
            string since = DateTime.Now.AddDays(-10).ToString("yyyy-MM-dd") + "T00:00:00+00:00"; // get the last 10 days
            // Pay attention to whether limit or offset comes first in the method signature. UltraCart is not consistent with their ordering.
            WebhookLogSummariesResponse apiResponse = webhookApi.GetWebhookLogSummaries(webhookOid, limit, offset, since);

            if (apiResponse.WebhookLogSummaries != null)
            {
                return apiResponse.WebhookLogSummaries;
            }
            return new List<WebhookLogSummary>();
        }

        public static void Execute()
        {
            WebhookApi webhookApi = new WebhookApi(Constants.ApiKey);
            
            List<WebhookLogSummary> summaries = new List<WebhookLogSummary>();

            int iteration = 1;
            int offset = 0;
            int limit = 200;
            bool moreRecordsToFetch = true;

            try
            {
                while (moreRecordsToFetch)
                {
                    Console.WriteLine("executing iteration " + iteration);

                    List<WebhookLogSummary> chunkOfSummaries = GetSummaryChunk(webhookApi, offset, limit);
                    summaries.AddRange(chunkOfSummaries);
                    offset = offset + limit;
                    moreRecordsToFetch = chunkOfSummaries.Count == limit;
                    iteration++;
                }
            }
            catch (ApiException e)
            {
                Console.WriteLine("ApiException occurred on iteration " + iteration);
                Console.WriteLine(e.ToString());
                Environment.Exit(1);
            }

            // this will be verbose...
            foreach (WebhookLogSummary summary in summaries)
            {
                Console.WriteLine(summary.ToString());
            }
        }
    }
}