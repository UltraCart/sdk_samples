using System;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.webhook
{
    public class GetWebhookLog
    {
        public static void Execute()
        {
            /*
             * getWebhookLog() provides a detail log of a webhook event. It is used in tandem with getWebhookLogSummaries to audit
             * webhook events. This method call will require the webhook_oid and the request_id. The webhook_oid can be discerned
             * from the results of getWebhooks() and the request_id can be found from getWebhookLogSummaries(). see those examples
             * if needed.
             */

            WebhookApi webhookApi = new WebhookApi(Constants.ApiKey);

            int webhookOid = 123456789; // call getWebhooks if you don't know this.
            string requestId = "987654321";  // call getWebhookLogSummaries if you don't know this.

            WebhookLogResponse apiResponse = webhookApi.GetWebhookLog(webhookOid, requestId);
            WebhookLog webhookLog = apiResponse.WebhookLog;

            if (apiResponse.Error != null)
            {
                Console.Error.WriteLine(apiResponse.Error.DeveloperMessage);
                Console.Error.WriteLine(apiResponse.Error.UserMessage);
                Environment.Exit(1);
            }

            Console.WriteLine("<html lang=\"en\"><body><pre>");
            Console.WriteLine(webhookLog.ToString());
            Console.WriteLine("</pre></body></html>");
        }
    }
}