import { autoOrderApi } from '../api';
import {
    OrderAutoOrderUpdateBillingUrlResponse
} from 'ultracart_rest_api_v2_typescript';

/**
 * getAutoOrderUpdateBillingUrl returns the url a customer uses to update the billing information on their
 * auto order.  This is the same url that is sent in the auto order update billing email.
 *
 * Requires the auto_order_write scope.  Write access is required because the url carries a customer access token.
 *
 * If you have an order id (original or rebill) instead of the auto_order_oid, see OrderApi.getUpdateBillingUrl.
 */
export async function execute(): Promise<void> {
    // If you don't know the oid, use getAutoOrdersByQuery for retrieving auto orders
    const autoOrderOid: number = 123456789;

    try {
        const response: OrderAutoOrderUpdateBillingUrlResponse = await autoOrderApi.getAutoOrderUpdateBillingUrl({
            autoOrderOid: autoOrderOid
        });

        // WARNING: The update billing url grants access to the customer's billing information.
        // Do not log it or expose it publicly in production.  It is printed here for demonstration only.
        console.log(`Success: ${response.success}`);
        console.log(`Update Billing Url: ${response.update_billing_url}`);
    } catch (error) {
        console.error('Error fetching auto order update billing url:', error);
    }
}
