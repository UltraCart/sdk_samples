import { orderApi } from '../api.js';

/**
 * unblockRefundOnOrder removes an order property that is considered when a refund request is made.
 * If the property is present, the refund is denied.  Being an order property allows for querying
 * upon it within BigQuery for audit purposes.
 */
export class UnblockRefundOnOrder {
    /**
     * Removes a property to prevent an order from being refunded.
     */
    static async execute() {
        const orderId = "DEMO-0009105222";


        try {
            await new Promise((resolve, reject) => {
                orderApi.unblockRefundOnOrder(orderId, function(error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            console.log("orderApi.unblockRefundOnOrder executed successfully.");
            // Note: This method returns back a 204 No Content.

        } catch (error) {
            console.error("Error removing block refund on an order.:", error);
        }
    }
}