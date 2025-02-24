import { orderApi } from '../api';

/**
 * OrderApi.DeleteOrder() will do just that.  It will delete an order.
 * You might find it more useful to reject an order rather than delete it in order to leave an audit trail.
 * However, deleting test orders will be useful to keep your order history tidy.  Still, any order
 * may be deleted.
 */
export async function execute(): Promise<void> {
    const orderId = "DEMO-0008104390";

    try {
        await orderApi.deleteOrder({
            orderId: orderId
        });
        console.log("Order was deleted successfully.");
    } catch (error) {
        console.error("An error occurred while deleting the order:", error);
    }
}