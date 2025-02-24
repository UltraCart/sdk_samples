// Import API and UltraCart types
import { webhookApi } from '../api.js';

// Namespace-like structure using a class
export class DeleteWebhook {
  static async execute() {
    /*
     * Deletes a webhook
     *
     * You will need the webhook_oid to call this method. Call getWebhooks() if you don't know your oid.
     * Returns status code 204 (No Content) on success
     */
    try {
      const webhookOid = 123456789; // call getWebhooks if you don't know this.

      // UltraCart API call with parameter as an anonymous object
      await new Promise((resolve, reject) => {
        webhookApi.deleteWebhook(webhookOid, function (error, data, response) {
          if (error) {
            reject(error);
          } else {
            resolve(data, response);
          }
        });
      });

      console.log(`Webhook ${webhookOid} deleted successfully`);
    } catch (ex) {
      console.log(`Error: ${ex.message}`);
      console.log(ex.stack);
    }
  }
}