package webhook;

import com.ultracart.admin.v2.WebhookApi;
import com.ultracart.admin.v2.models.*;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

public class GetWebhookLog {
   public static void execute() throws ApiException {
       /*
        * getWebhookLog() provides a detail log of a webhook event. It is used in tandem with getWebhookLogSummaries to audit
        * webhook events. This method call will require the webhook_oid and the request_id. The webhook_oid can be discerned
        * from the results of getWebhooks() and the request_id can be found from getWebhookLogSummaries(). see those examples
        * if needed.
        */

       WebhookApi webhookApi = new WebhookApi(Constants.API_KEY);

       int webhookOid = 123456789; // call getWebhooks if you don't know this.
       String requestId = "987654321";  // call getWebhookLogSummaries if you don't know this.

       WebhookLogResponse apiResponse = webhookApi.getWebhookLog(webhookOid, requestId);
       WebhookLog webhookLog = apiResponse.getWebhookLog();

       if (apiResponse.getError() != null) {
           System.err.println(apiResponse.getError().getDeveloperMessage());
           System.err.println(apiResponse.getError().getUserMessage());
           System.exit(1);
       }

       System.out.println(webhookLog.toString());
   }
}