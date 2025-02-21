package webhook;

import com.ultracart.admin.v2.WebhookApi;
import com.ultracart.admin.v2.models.Webhook;
import com.ultracart.admin.v2.models.WebhookResponse;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

import java.util.List;

public class UpdateWebhook {
    public static void execute() {
        /*
         * Updates a webhook on the account.  See insertWebhook.php for a complete example with field usage.
         * For this example, we are just updating the basic password.
         */

        WebhookApi webhookApi = new WebhookApi(Constants.API_KEY);

        // you should have stored this when you created the webhook.  If you don't know it, call getWebhooks and iterate through
        // them to find you target webhook (add useful comments to each webhook really helps in this endeavor) and get the
        // webhook oid from that.  You'll want to call getWebhooks any way to get the object for updating. It is HIGHLY
        // recommended to get the object from UltraCart for updating rather than constructing it yourself to avoid accidentally
        // deleting a part of the object during the update.
        int webhookOid = 123456789;

        try {
            Webhook webhookToUpdate = null;
            List<Webhook> webhooks = webhookApi.getWebhooks(100, 0, null, null).getWebhooks();
            for (Webhook webhook : webhooks) {
                if (webhook.getWebhookOid() == webhookOid) {
                    webhookToUpdate = webhook;
                    break;
                }
            }

            if (webhookToUpdate == null) {
                System.err.println("Webhook not found with OID: " + webhookOid);
                System.exit(1);
                return;
            }

            webhookToUpdate.setBasicPassword("new password here");
            WebhookResponse apiResponse = webhookApi.updateWebhook(webhookOid, webhookToUpdate, false);
            Webhook updatedWebhook = apiResponse.getWebhook();

            if (apiResponse.getError() != null) {
                System.err.println(apiResponse.getError().getDeveloperMessage());
                System.err.println(apiResponse.getError().getUserMessage());
                System.exit(1);
            }

            System.out.println(updatedWebhook.toString());
        } catch (ApiException e) {
            System.err.println("API Exception occurred: " + e.getMessage());
            e.printStackTrace();
            System.exit(1);
        }
    }
}