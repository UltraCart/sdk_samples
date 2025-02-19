using System;
using System.Collections.Generic;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.webhook
{
    public class UpdateWebhook
    {
        public static void Execute()
        {
            /*
             * Updates a webhook on the account.  See insertWebhook.php for a complete example with field usage.
             * For this example, we are just updating the basic password.
             */

            WebhookApi webhookApi = new WebhookApi(Constants.ApiKey);

            // you should have stored this when you created the webhook.  If you don't know it, call getWebhooks and iterate through
            // them to find you target webhook (add useful comments to each webhook really helps in this endeavor) and get the
            // webhook oid from that.  You'll want to call getWebhooks any way to get the object for updating. It is HIGHLY
            // recommended to get the object from UltraCart for updating rather than constructing it yourself to avoid accidentally
            // deleting a part of the object during the update.
            int webhookOid = 123456789;

            Webhook webhookToUpdate = null;
            List<Webhook> webhooks = webhookApi.GetWebhooks(100, 0, null, null).Webhooks;
            foreach (Webhook webhook in webhooks)
            {
                if (webhook.WebhookOid == webhookOid)
                {
                    webhookToUpdate = webhook;
                    break;
                }
            }

            webhookToUpdate.BasicPassword = "new password here";
            WebhookResponse apiResponse = webhookApi.UpdateWebhook(webhookOid, webhookToUpdate);
            Webhook updatedWebhook = apiResponse.Webhook;

            if (apiResponse.Error != null)
            {
                Console.Error.WriteLine(apiResponse.Error.DeveloperMessage);
                Console.Error.WriteLine(apiResponse.Error.UserMessage);
                Environment.Exit(1);
            }

 
            Console.WriteLine(updatedWebhook.ToString());
 
        }
    }
}