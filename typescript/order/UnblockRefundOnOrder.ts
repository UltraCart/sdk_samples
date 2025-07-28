import { orderApi } from '../api';
import { OrderRefundableResponse } from 'ultracart_rest_api_v2_typescript';

/**
 * unblockRefundOnOrder removes an order property that is considered when a refund request is made.
 * If the property is present, the refund is denied.  Being an order property allows for querying
 * upon it within BigQuery for audit purposes.
 */
export class UnblockRefundOnOrder {
    /**
     * Removes a property to prevent an order from being refunded.
     */
    public static async execute(): Promise<void> {
        const orderId = "DEMO-0009105222";

        try {
            await orderApi.unblockRefundOnOrder({orderId: orderId});

            console.log("orderApi.unblockRefundOnOrder executed successfully.");
            // Note: This method returns back a 204 No Content.

        } catch (error) {
            console.error("Error removing block refund on an order.:", error);
        }
    }
}

