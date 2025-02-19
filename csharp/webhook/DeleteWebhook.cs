using System;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.webhook
{
    public class DeleteWebhook
    {
        public static void Execute()
        {
            /*
             * Deletes a webhook
             *
             * You will need the webhook_oid to call this method. Call getWebhooks() if you don't know your oid.
             * Returns status code 204 (No Content) on success
             */

            WebhookApi webhookApi = new WebhookApi(Constants.ApiKey);
            int webhookOid = 123456789; // call getWebhooks if you don't know this.
            webhookApi.DeleteWebhook(webhookOid);
        }
    }
}