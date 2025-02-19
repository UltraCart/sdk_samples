using System;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.webhook
{
    public class ResendEvent
    {
        public static void Execute()
        {
            /*
             * resentEvent is used to reflow an event.  It will resend ALL events in history.  So it is essentially a way to
             * get all objects from an event.  Currently, there are only two events available for reflow: "item_update", and "order_create".
             * These two events provide the means to have a webhook receive all items or orders.  This method is usually called
             * at the beginning of a webhook's life to prepopulate a merchant's database with all items or orders.
             *
             * You will need the webhook_oid to call this method.  Call getWebhooks() if you don't know your oid.
             */

            WebhookApi webhookApi = new WebhookApi(Constants.ApiKey);

            int webhookOid = 123456789; // call getWebhooks if you don't know this.
            string eventName = "item_update"; // or "order_create", but for this sample, we want all items.

            WebhookReflowResponse apiResponse = webhookApi.ResendEvent(webhookOid, eventName);
            WebhookReflow reflow = apiResponse.Reflow;
            bool success = reflow.Queued;

            if (apiResponse.Error != null)
            {
                Console.Error.WriteLine(apiResponse.Error.DeveloperMessage);
                Console.Error.WriteLine(apiResponse.Error.UserMessage);
                Environment.Exit(1);
            }

            Console.WriteLine(apiResponse.ToString());
        }
    }
}