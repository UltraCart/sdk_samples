package webhook;

import com.ultracart.admin.v2.WebhookApi;
import com.ultracart.admin.v2.models.*;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

public class DeleteWebhookByUrl {
   public static void execute() throws ApiException {
       /*
        * This method can be confusing due to its payload. The method does indeed delete a webhook by url, but you need to
        * pass a webhook object in as the payload. However, only the url is used. UltraCart does this to avoid any confusion
        * with the rest url versus the webhook url.
        *
        * To use:
        * Get your webhook url.
        * Create a Webhook object.
        * Set the Webhook url property.
        * Pass the webhook to deleteWebhookByUrl()
        *
        * Returns status code 204 (No Content) on success
        */

       WebhookApi webhookApi = new WebhookApi(Constants.API_KEY);

       String webhookUrl = "https://www.mywebiste.com/page/to/call/when/this/webhook/fires.php";
       Webhook webhook = new Webhook();
       webhook.setWebhookUrl(webhookUrl);

       webhookApi.deleteWebhookByUrl(webhook);
   }
}