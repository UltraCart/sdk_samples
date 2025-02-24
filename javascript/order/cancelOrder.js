import { orderApi } from '../api.js';

/**
 * OrderApi.CancelOrder() will do just that.  It will cancel an order by rejecting it.
 * However, the following restrictions apply:
 * 1) If the order is already completed, this call will fail.
 * 2) If the order has already been rejected, this call will fail.
 * 3) If the order has already been transmitted to a fulfillment center, this call will fail.
 * 4) If the order is queued for transmission to a distribution center, this call will fail.
 */
export class CancelOrder {
    /**
     * Attempts to cancel a specific order
     * @param apiKey The API key for authentication
     * @returns Promise resolving to whether the order was successfully canceled
     */
    static async execute(apiKey) {
        const orderId = "DEMO-0009104390";

        try {
            const apiResponse = await new Promise((resolve, reject) => {
                orderApi.cancelOrder(orderId, function(error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            if (apiResponse.error) {
                console.error(apiResponse.error.developer_message);
                console.error(apiResponse.error.user_message);
                console.log("Order could not be canceled. See error log.");
                return false;
            }

            if (apiResponse.success) {
                console.log("Order was canceled successfully.");
                return true;
            }

            return false;
        } catch (error) {
            console.error("An error occurred while canceling the order:", error);
            return false;
        }
    }
}

// Example usage
async function cancelOrderExample() {
    const apiKey = "your-api-key-here"; // Replace with actual API key
    const result = await CancelOrder.execute(apiKey);
    console.log(result ? "Order cancellation successful" : "Order cancellation failed");
}