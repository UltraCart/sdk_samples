import { webhookApi } from '../api.js';

export class ResendEvent {
    /**
     * ResendEvent is used to reflow an event. It will resend ALL events in history.
     * So it is essentially a way to get all objects from an event. Currently, there are
     * only two events available for reflow: "item_update", and "order_create".
     *
     * These two events provide the means to have a webhook receive all items or orders.
     * This method is usually called at the beginning of a webhook's life to prepopulate
     * a merchant's database with all items or orders.
     *
     * You will need the webhook_oid to call this method. Call getWebhooks() if you don't know your oid.
     */
    static async execute() {
        const webhookOid = 123456789; // call getWebhooks if you don't know this.
        const eventName = "item_update"; // or "order_create", but for this sample, we want all items.

        try {
            const apiResponse = await new Promise((resolve, reject) => {
                webhookApi.resendEvent(webhookOid, eventName, function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data, response);
                    }
                });
            });

            const reflow = apiResponse.reflow;
            const success = !!(reflow && reflow.queued);

            if (apiResponse.error) {
                console.error(apiResponse.error.developer_message);
                console.error(apiResponse.error.user_message);
                process.exit(1);
            }

            console.log(apiResponse.toString());
        } catch (error) {
            console.error('Error resending event:', error);
            process.exit(1);
        }
    }
}

// Optional: If you want to run this directly
if (require.main === module) {
    ResendEvent.execute().catch(console.error);
}