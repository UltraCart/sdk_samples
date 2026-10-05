import {orderApi} from '../api.js';

export class AssignRma {
    /**
     * OrderApi.assignRma() associates an RMA (return merchandise authorization) number with an order.
     *
     * Notes:
     * 1. The rma value is required, is trimmed, and may be at most 30 characters.
     * 2. Any existing RMA on the order is replaced.
     * 3. A merchant note is added to the order recording the RMA assignment.
     * 4. The optional _expand parameter controls how much of the updated order is returned.
     * 5. Requires the order_write scope.
     *
     * Use OrderApi.getOrdersByRma() to look up orders by RMA later.
     */
    static async execute() {
        const orderId = 'DEMO-0009104436';
        const assignRmaRequest = {
            rma: 'RMA-12345'
        };

        // see www.ultracart.com/api/ for all the expansion fields available
        const expansion = 'item,summary';

        try {
            const apiResponse = await new Promise((resolve, reject) => {
                orderApi.assignRma(orderId, assignRmaRequest, {_expand: expansion}, function (error, data, response) {
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
                throw new Error('Failed to assign RMA');
            }

            console.log(JSON.stringify(apiResponse.order, null, 2));

            return apiResponse.order;
        } catch (error) {
            console.error('Error assigning RMA:', error);
            throw error;
        }
    }
}

// Optional: If you want to call the method
// AssignRma.execute().then(order => {
//     // Do something with the order
// }).catch(error => {
//     // Handle any errors
// });
