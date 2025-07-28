import { orderApi } from '../api.js';

/**
 * blockRefundOnOrder sets an order property that is considered when a refund request is made.
 * If the property is present, the refund is denied.  Being an order property allows for querying
 * upon it within BigQuery for audit purposes.
 */
export class BlockRefundOnOrder {
    /**
     * Sets a property to prevent an order from being refunded.
     */
    static async execute() {
        const orderId = "DEMO-0009105222";
        let opts = {};
        opts.block_reason = 'Chargeback';


        try {
            await new Promise((resolve, reject) => {
                orderApi.blockRefundOnOrder(orderId, opts, function(error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            console.log("orderApi.blockRefundOnOrder executed successfully.");
            // Note: This method returns back a 204 No Content.

        } catch (error) {
            console.error("Error setting block refund on an order.:", error);
        }
    }
}