// Import API and UltraCart types
import { webhookApi } from '../api.js';

// Namespace-like structure using a class
export class GetWebhookLog {
  static async execute() {
    /*
     * getWebhookLog() provides a detail log of a webhook event. It is used in tandem with getWebhookLogSummaries to audit
     * webhook events. This method call will require the webhook_oid and the request_id. The webhook_oid can be discerned
     * from the results of getWebhooks() and the request_id can be found from getWebhookLogSummaries(). See those examples
     * if needed.
     */
    try {
      const webhookOid = 123456789; // call getWebhooks if you don't know this
      const requestId = "987654321"; // call getWebhookLogSummaries if you don't know this

      // UltraCart API call with parameters as an anonymous object
      const apiResponse = await new Promise((resolve, reject) => {
        webhookApi.getWebhookLog(webhookOid,requestId, function (error, data, response) {
          if (error) {
            reject(error);
          } else {
            resolve(data, response);
          }
        });
      });

      const webhookLog = apiResponse.webhook_log;

      if (apiResponse.error) {
        console.error(apiResponse.error.developer_message);
        console.error(apiResponse.error.user_message);
        process.exit(1); // Equivalent to Environment.Exit(1) in Node.js
      }

      // For Node.js/console output (adjust for other environments)
      console.log(webhookLog); // JSON-like object output; no ToString() equivalent in TS by default
    } catch (ex) {
      console.log(`Error: ${ex.message}`);
      console.log(ex.stack);
    }
  }
}