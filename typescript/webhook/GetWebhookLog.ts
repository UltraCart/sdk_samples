// Import API and UltraCart types
import { webhookApi } from '../api';
import { WebhookLog, WebhookLogResponse } from 'ultracart_rest_api_v2_typescript';

// Namespace-like structure using a class
export class GetWebhookLog {
  public static async execute(): Promise<void> {
    /*
     * getWebhookLog() provides a detail log of a webhook event. It is used in tandem with getWebhookLogSummaries to audit
     * webhook events. This method call will require the webhook_oid and the request_id. The webhook_oid can be discerned
     * from the results of getWebhooks() and the request_id can be found from getWebhookLogSummaries(). See those examples
     * if needed.
     */
    try {
      const webhookOid = 123456789; // call getWebhooks if you don't know this
      const requestId = "987654321"; // call getWebhookLogSummaries if you don't know this

      // UltraCart API call with parameters as an anonymous interface
      const apiResponse = await webhookApi.getWebhookLog({
        webhookOid: webhookOid,
        requestId: requestId,
      });

      const webhookLog: WebhookLog | undefined = apiResponse.webhook_log;

      if (apiResponse.error) {
        console.error(apiResponse.error.developer_message);
        console.error(apiResponse.error.user_message);
        process.exit(1); // Equivalent to Environment.Exit(1) in Node.js
      }

      // For Node.js/console output (adjust for other environments)
      console.log(webhookLog); // JSON-like object output; no ToString() equivalent in TS by default
    } catch (ex) {
      console.log(`Error: ${(ex as Error).message}`);
      console.log((ex as Error).stack);
    }
  }
}

