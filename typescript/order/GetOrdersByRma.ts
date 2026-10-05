import { orderApi } from '../api';
import {
    OrdersResponse,
    Order
} from 'ultracart_rest_api_v2_typescript';

/**
 * getOrdersByRma returns all orders that carry a given RMA (return merchandise authorization) number.
 *
 * The rma must be an exact match.  Wildcards are not supported; an rma containing * returns a 400 error.
 * More than one order can share the same RMA, so the result is always an array of orders.
 *
 * This lookup is backed by the search index, so an RMA that was just assigned with assignRma may take a
 * short time to appear in the results.
 *
 * The optional expand parameter controls how much of each order is returned.
 * See https://www.ultracart.com/api/#resource_order.html for the list of expansions.
 *
 * Requires the order_read scope.
 */
export async function execute(): Promise<void> {
    const rma = "RMA-12345";
    const expand = "summary";

    try {
        const response: OrdersResponse = await orderApi.getOrdersByRma({
            rma: rma,
            expand: expand
        });

        const orders: Order[] = response.orders || [];

        if (orders.length === 0) {
            console.log('No orders were found with this rma.');
            return;
        }

        for (const order of orders) {
            console.log(JSON.stringify(order, null, 2));
        }
    } catch (error) {
        console.error('Error fetching orders by rma:', error);
    }
}
