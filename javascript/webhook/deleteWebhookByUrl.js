// Import API and UltraCart types
import {webhookApi} from '../api.js';

// Namespace-like structure using a class
export class DeleteWebhookByUrl {
    static async execute() {
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
            const webhook = {
                webhook_url: webhookUrl,
            };

            // UltraCart API call with parameter as an anonymous object
            await new Promise((resolve, reject) => {
                webhookApi.deleteWebhookByUrl(webhook, function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data, response);
                    }
                });
            });

            console.log(`Webhook with URL ${webhookUrl} deleted successfully`);
        } catch (ex) {
            console.log(`Error: ${ex.message}`);
            console.log(ex.stack);
        }
    }
}