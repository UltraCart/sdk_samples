import { orderApi } from '../api.js';

/**
 * OrderApi.DeleteOrder() will do just that.  It will delete an order.
 * You might find it more useful to reject an order rather than delete it in order to leave an audit trail.
 * However, deleting test orders will be useful to keep your order history tidy.  Still, any order
 * may be deleted.
 */
export async function execute() {
    const orderId = "DEMO-0008104390";

    try {
        await new Promise((resolve, reject) => {
            orderApi.deleteOrder(orderId, function (error, data, response) {
                if (error) {
                    reject(error);
                } else {
                    resolve(data, response);
                }
            });
        });
        console.log("Order was deleted successfully.");
    } catch (error) {
        console.error("An error occurred while deleting the order:", error);
    }
}