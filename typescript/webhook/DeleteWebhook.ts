// Import API and UltraCart types
import { webhookApi } from '../api';

// Namespace-like structure using a class
export class DeleteWebhook {
  public static async execute(): Promise<void> {
    /*
     * Deletes a webhook
     *
     * You will need the webhook_oid to call this method. Call getWebhooks() if you don't know your oid.
     * Returns status code 204 (No Content) on success
     */
    try {
      const webhookOid = 123456789; // call getWebhooks if you don't know this.

      // UltraCart API call with parameter as an anonymous interface
      await webhookApi.deleteWebhook({
        webhookOid: webhookOid,
      });

      console.log(`Webhook ${webhookOid} deleted successfully`);
    } catch (ex) {
      console.log(`Error: ${(ex as Error).message}`);
      console.log((ex as Error).stack);
    }
  }
}

