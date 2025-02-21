package webhook;

import com.ultracart.admin.v2.WebhookApi;
import com.ultracart.admin.v2.models.*;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

public class DeleteWebhook {
   public static void execute() throws ApiException {
       /*
        * Deletes a webhook
        *
        * You will need the webhook_oid to call this method. Call getWebhooks() if you don't know your oid.
        * Returns status code 204 (No Content) on success
        */

       WebhookApi webhookApi = new WebhookApi(Constants.API_KEY);
       int webhookOid = 123456789; // call getWebhooks if you don't know this.
       webhookApi.deleteWebhook(webhookOid);
   }
}