import {orderApi} from '../api.js';

export class GetOrdersByRma {
    /**
     * OrderApi.getOrdersByRma() retrieves the orders associated with an RMA number.
     *
     * Notes:
     * 1. The RMA must be an exact match.  Wildcards (*) are not permitted and will return a 400 error.
     * 2. More than one order may share the same RMA, so a list of orders is returned.
     * 3. This lookup is backed by a search index, so an RMA that was just assigned with OrderApi.assignRma()
     *    may take a short time to appear in the results.
     * 4. Requires the order_read scope.
     */
    static async execute() {
        const rma = 'RMA-12345';

        // see www.ultracart.com/api/ for all the expansion fields available
        const expansion = 'item,summary,billing,shipping';

        try {
            const apiResponse = await new Promise((resolve, reject) => {
                orderApi.getOrdersByRma(rma, {_expand: expansion}, function (error, data, response) {
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
                throw new Error('Failed to retrieve orders by RMA');
            }

            const orders = apiResponse.orders || [];
            console.log(`Found ${orders.length} order(s) for RMA ${rma}`);
            orders.forEach(order => {
                console.log(JSON.stringify(order, null, 2));
            });

            return orders;
        } catch (error) {
            console.error('Error retrieving orders by RMA:', error);
            throw error;
        }
    }
}

// Optional: If you want to call the method
// GetOrdersByRma.execute().then(orders => {
//     // Do something with the orders
// }).catch(error => {
//     // Handle any errors
// });
