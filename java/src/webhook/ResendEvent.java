package webhook;

import com.ultracart.admin.v2.WebhookApi;
import com.ultracart.admin.v2.models.WebhookReflowResponse;
import com.ultracart.admin.v2.models.WebhookReflow;
import com.ultracart.admin.v2.util.ApiException;

import common.Constants;

public class ResendEvent {
    public static void execute() {
        /*
         * resentEvent is used to reflow an event.  It will resend ALL events in history.  So it is essentially a way to
         * get all objects from an event.  Currently, there are only two events available for reflow: "item_update", and "order_create".
         * These two events provide the means to have a webhook receive all items or orders.  This method is usually called
         * at the beginning of a webhook's life to prepopulate a merchant's database with all items or orders.
         *
         * You will need the webhook_oid to call this method.  Call getWebhooks() if you don't know your oid.
         */

        WebhookApi webhookApi = new WebhookApi(Constants.API_KEY);

        int webhookOid = 123456789; // call getWebhooks if you don't know this.
        String eventName = "item_update"; // or "order_create", but for this sample, we want all items.

        try {
            WebhookReflowResponse apiResponse = webhookApi.resendEvent(webhookOid, eventName);
            WebhookReflow reflow = apiResponse.getReflow();
            boolean success = reflow.getQueued();

            if (apiResponse.getError() != null) {
                System.err.println(apiResponse.getError().getDeveloperMessage());
                System.err.println(apiResponse.getError().getUserMessage());
                System.exit(1);
            }

            System.out.println(apiResponse.toString());
        } catch (ApiException e) {
            System.err.println("API Exception occurred: " + e.getMessage());
            e.printStackTrace();
            System.exit(1);
        }
    }
}