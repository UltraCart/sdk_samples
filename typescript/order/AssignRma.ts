import { orderApi } from '../api';
import {
    OrderAssignRmaRequest,
    OrderResponse,
    Order
} from 'ultracart_rest_api_v2_typescript';

/**
 * assignRma assigns an RMA (return merchandise authorization) number to an order.
 *
 * The rma value is required, is trimmed, and may be at most 30 characters.  Any RMA already on the
 * order is replaced, and a merchant note is added to the order recording the change.
 *
 * The optional expand parameter controls how much of the updated order is returned.
 * See https://www.ultracart.com/api/#resource_order.html for the list of expansions.
 *
 * Requires the order_write scope.
 */
export async function execute(): Promise<void> {
    const orderId = "DEMO-0009104976";
    const expand = "summary";

    const assignRmaRequest: OrderAssignRmaRequest = {
        rma: "RMA-12345"
    };

    try {
        const response: OrderResponse = await orderApi.assignRma({
            orderId: orderId,
            assignRmaRequest: assignRmaRequest,
            expand: expand
        });

        const order: Order | undefined = response.order;
        console.log(JSON.stringify(order, null, 2));
    } catch (error) {
        console.error('Error assigning rma:', error);
    }
}
