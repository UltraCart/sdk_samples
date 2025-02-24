import {orderApi} from '../api.js';

export class UpdateOrder {
    static async execute() {
        const expansion = "checkout"; // see the getOrder sample for expansion discussion

        const orderId = "DEMO-0009104976";
        const orderOrUndefined = await new Promise((resolve, reject) => {
            orderApi.getOrder(
                orderId,
                {_expand: expansion}, function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
        });

        if (orderOrUndefined.order !== undefined) {
            const order = orderOrUndefined.order;

            console.log("Original Order follows:");
            console.log(JSON.stringify(order, null, 2));

            // TODO: do some updates to the order.
            // For example:
            // order.billingAddress.firstName = "John";
            // order.billingAddress.lastName = "Smith";

            const apiResponse = await new Promise((resolve, reject) => {
                orderApi.updateOrder(
                    orderId,
                    order,
                    {_expand: expansion}, function (error, data, response) {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(data);
                        }
                    });
            });

            if (apiResponse.error !== undefined) {
                console.error(apiResponse.error.developer_message);
                console.error(apiResponse.error.user_message);
                return;
            }

            const updatedOrder = apiResponse.order;

            console.log("Updated Order follows:");
            console.log(JSON.stringify(updatedOrder, null, 2));
        }
    }
}