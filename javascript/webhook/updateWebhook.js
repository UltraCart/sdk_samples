import { webhookApi } from '../api.js';

export class UpdateWebhook {
    /**
     * Updates a webhook on the account. See insertWebhook.php for a complete example with field usage.
     * For this example, we are just updating the basic password.
     *
     * Notes:
     * - You should have stored the webhook OID when you created the webhook.
     * - If you don't know the OID, call getWebhooks and iterate through them to find your target webhook.
     * - Adding useful comments to each webhook helps in identifying the correct one.
     *
     * HIGHLY RECOMMENDED:
     * - Get the object from UltraCart for updating
     * - Avoid constructing the object yourself to prevent accidentally deleting parts of the object during update
     */
    static async execute() {
        // You should have stored this when you created the webhook
        const webhookOid = 123456789;

        try {
            // Fetch webhooks to find the specific one to update
            const webhooksResponse = await new Promise((resolve, reject) => {
                webhookApi.getWebhooks({_limit: 100, _offset: 0}, function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data, response);
                    }
                });
            });

            const webhooks = webhooksResponse.webhooks || [];

            // Find the specific webhook to update
            const webhookToUpdate = webhooks.find(webhook => webhook.webhook_oid === webhookOid);

            if (!webhookToUpdate) {
                console.error(`Webhook with OID ${webhookOid} not found`);
                process.exit(1);
            }

            // Update the basic password
            webhookToUpdate.basic_password = "new password here";

            // Perform the update
            const apiResponse = await new Promise((resolve, reject) => {
                webhookApi.updateWebhook(webhookOid, webhookToUpdate, function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data, response);
                    }
                });
            });

            // Check for errors
            if (apiResponse.error) {
                console.error(apiResponse.error.developer_message);
                console.error(apiResponse.error.user_message);
                process.exit(1);
            }

            // Log the updated webhook
            const updatedWebhook = apiResponse.webhook;
            console.log(updatedWebhook?.toString());

        } catch (error) {
            console.error('Error updating webhook:', error);
            process.exit(1);
        }
    }
}

// Optional: If you want to run this directly
if (require.main === module) {
    UpdateWebhook.execute().catch(console.error);
}