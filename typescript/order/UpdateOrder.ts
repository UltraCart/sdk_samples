import {orderApi} from '../api';
import {Order, OrderResponse} from 'ultracart_rest_api_v2_typescript';

export class UpdateOrder {
    public static async execute(): Promise<void> {
        const expansion: string = "checkout"; // see the getOrder sample for expansion discussion

        const orderId: string = "DEMO-0009104976";
        const orderOrUndefined: Order | undefined = (await orderApi.getOrder({orderId, expand: expansion})).order;

        if (orderOrUndefined !== undefined) {
            const order = orderOrUndefined as Order;

            console.log("Original Order follows:");
            console.log(JSON.stringify(order, null, 2));

            // TODO: do some updates to the order.
            // For example:
            // order.billingAddress.firstName = "John";
            // order.billingAddress.lastName = "Smith";

            const apiResponse: OrderResponse = await orderApi.updateOrder({
                orderId: orderId,
                order: order,
                expand: expansion
            });

            if (apiResponse.error !== undefined) {
                console.error(apiResponse.error.developer_message);
                console.error(apiResponse.error.user_message);
                return;
            }

            const updatedOrder: Order | undefined = apiResponse.order;

            console.log("Updated Order follows:");
            console.log(JSON.stringify(updatedOrder, null, 2));
        }
    }
}