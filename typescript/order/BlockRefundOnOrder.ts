import { orderApi } from '../api';
import { OrderRefundableResponse } from 'ultracart_rest_api_v2_typescript';

/**
 * blockRefundOnOrder sets an order property that is considered when a refund request is made.
 * If the property is present, the refund is denied.  Being an order property allows for querying
 * upon it within BigQuery for audit purposes.
 */
export class BlockRefundOnOrder {
    /**
     * Sets a property to prevent an order from being refunded.
     */
    public static async execute(): Promise<void> {
        const orderId = "DEMO-0009105222";

        try {
            await orderApi.blockRefundOnOrder({orderId: orderId, blockReason: 'Chargeback'});

            console.log("orderApi.blockRefundOnOrder executed successfully.");
            // Note: This method returns back a 204 No Content.

        } catch (error) {
            console.error("Error setting block refund on an order.:", error);
        }
    }
}

