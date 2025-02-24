// Import API and UltraCart types
import { webhookApi } from '../api';
import { Webhook } from 'ultracart_rest_api_v2_typescript';

// Namespace-like structure using a class
export class DeleteWebhookByUrl {
  public static async execute(): Promise<void> {
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
    try {
      const webhookUrl = "https://www.mywebiste.com/page/to/call/when/this/webhook/fires.php";
      const webhook: Webhook = {
        webhook_url: webhookUrl,
      };

      // UltraCart API call with parameter as an anonymous interface
      await webhookApi.deleteWebhookByUrl({
        webhook: webhook,
      });

      console.log(`Webhook with URL ${webhookUrl} deleted successfully`);
    } catch (ex) {
      console.log(`Error: ${(ex as Error).message}`);
      console.log((ex as Error).stack);
    }
  }
}
