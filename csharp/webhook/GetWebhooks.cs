using System;
using System.Collections.Generic;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Client;
using com.ultracart.admin.v2.Model;

namespace SdkSample.webhook
{
    public class GetWebhooks
    {
        /*
         * This example illustrates how to retrieve all webhooks.
         */

        /// <summary>
        /// Gets a chunk of webhooks
        /// </summary>
        /// <param name="webhookApi">The webhook API instance</param>
        /// <param name="offset">Offset for pagination</param>
        /// <param name="limit">Maximum number of records to return</param>
        /// <returns>List of webhooks</returns>
        /// <exception cref="ApiException">Thrown when API call fails</exception>
        private static List<Webhook> GetWebhookChunk(WebhookApi webhookApi, int offset, int limit)
        {
            string sort = null; // default sorting is webhook_url, disabled, and those are also the two choices for sorting.
            bool? placeholders = null;  // useful for UI displays, but not needed here.
            // Pay attention to whether limit or offset comes first in the method signature. UltraCart is not consistent with their ordering.
            WebhooksResponse apiResponse = webhookApi.GetWebhooks(limit, offset, sort, placeholders);

            if (apiResponse.Webhooks != null)
            {
                return apiResponse.Webhooks;
            }
            return new List<Webhook>();
        }

        public static void Execute()
        {
            WebhookApi webhookApi = new WebhookApi(Constants.ApiKey);
            
            List<Webhook> webhooks = new List<Webhook>();

            int iteration = 1;
            int offset = 0;
            int limit = 200;
            bool moreRecordsToFetch = true;

            try
            {
                while (moreRecordsToFetch)
                {
                    Console.WriteLine("executing iteration " + iteration);

                    List<Webhook> chunkOfWebhooks = GetWebhookChunk(webhookApi, offset, limit);
                    webhooks.AddRange(chunkOfWebhooks);
                    offset = offset + limit;
                    moreRecordsToFetch = chunkOfWebhooks.Count == limit;
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
            foreach (Webhook webhook in webhooks)
            {
                Console.WriteLine(webhook.ToString());
            }
        }
    }
}