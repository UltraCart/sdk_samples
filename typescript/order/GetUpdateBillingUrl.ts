import { orderApi } from '../api';
import {
    OrderAutoOrderUpdateBillingUrlResponse
} from 'ultracart_rest_api_v2_typescript';

/**
 * getUpdateBillingUrl returns the url a customer uses to update the billing information on their auto order.
 * This is the same url that is sent in the auto order update billing email.
 *
 * The order must belong to an auto order, otherwise a 400 error is returned.  Either the original order
 * or any of the rebill orders may be used.
 *
 * Requires the order_write scope.  Write access is required because the url carries a customer access token.
 *
 * If you have the auto_order_oid instead of an order id, see AutoOrderApi.getAutoOrderUpdateBillingUrl.
 */
export async function execute(): Promise<void> {
    const orderId = "DEMO-0009104976";

    try {
        const response: OrderAutoOrderUpdateBillingUrlResponse = await orderApi.getUpdateBillingUrl({
            orderId: orderId
        });

        // WARNING: The update billing url grants access to the customer's billing information.
        // Do not log it or expose it publicly in production.  It is printed here for demonstration only.
        console.log(`Success: ${response.success}`);
        console.log(`Update Billing Url: ${response.update_billing_url}`);
    } catch (error) {
        console.error('Error fetching update billing url:', error);
    }
}
