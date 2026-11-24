import {orderApi} from '../api.js';

/*
 * OrderApi.cancelOrderWithOptions() cancels an order, the same as cancelOrder(), with the options in a request body.
 * An empty cancel request behaves exactly like cancelOrder().
 *
 * Options:
 * - reject_reason:          stored on the order when it is rejected without a refund (Accounts Receivable, Pre-order,
 *                           Quote or Hold), the same as the reject reason in the backend.  Reasons are configured at
 *                           Home -> Configuration -> Order Management -> Refund/Reject Reasons
 * - lock_self_ship_orders:  prevent the order from shipping during the refund process
 * - skip_refund_and_hold:   skip the refund and move the order to the Held Orders department
 *
 * Rejecting an order in Accounts Receivable:
 * - The customer is not emailed.
 * - A rejected auto order rebill leaves the auto order active, so it rebills on its next cycle.
 * - Rejecting the auto order's original order cancels the auto order, because the first payment never succeeded.
 *
 * Restrictions (the same as cancelOrder()):
 * 1) Cannot cancel completed orders
 * 2) Cannot cancel already rejected orders
 * 3) Cannot cancel orders transmitted to fulfillment center
 * 4) Cannot cancel orders queued for distribution center transmission
 *
 * Requires SDK 4.1.260 or later.
 */
export class CancelOrderWithOptions {
    static async execute() {
        const orderId = "DEMO-0009104436";

        const cancelRequest = {
            reject_reason: "Card declined"
        };

        try {
            const apiResponse = await new Promise((resolve, reject) => {
                orderApi.cancelOrderWithOptions(orderId, cancelRequest, function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            if (apiResponse.error) {
                console.error('Developer Message:', apiResponse.error.developer_message);
                console.error('User Message:', apiResponse.error.user_message);
                console.log('Order could not be canceled.');
                return;
            }

            if (apiResponse.success) {
                console.log('Order was canceled successfully.');
            }
        } catch (error) {
            console.error('Error canceling order:', error);
        }
    }
}

// Optional: If you want to call the method
// CancelOrderWithOptions.execute().then(() => {}).catch(error => console.error(error));
