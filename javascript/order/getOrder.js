import { orderApi } from '../api.js';

export class GetOrder {
    /**
     * OrderApi.getOrder() retrieves a single order for a given order_id.
     */
    static async execute() {
        // The expansion variable instructs UltraCart how much information to return.  The order object is large and
        // while it's easily manageable for a single order, when querying thousands of orders, is useful to reduce
        // payload size.
        // see www.ultracart.com/api/ for all the expansion fields available (this list below may become stale)
        /*
        Possible Order Expansions:
        affiliate           affiliate.ledger                    auto_order
        billing             channel_partner                     checkout
        coupon              customer_profile                    digital_order
        edi                 fraud_score                         gift
        gift_certificate    internal                            item
        linked_shipment     marketing                           payment
        payment.transaction quote                               salesforce
        shipping            shipping.tracking_number_details    summary
        taxes
        */
        const expansion = 'item,summary,billing,shipping,shipping.tracking_number_details';

        const orderId = 'DEMO-0009104390';

        try {
            // Retrieve the order
            const apiResponse = await new Promise((resolve, reject) => {
                orderApi.getOrder(orderId, {_expand: expansion }, function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            // Check for errors
            if (apiResponse.error) {
                console.error('Developer Message:', apiResponse.error.developer_message);
                console.error('User Message:', apiResponse.error.user_message);
                throw new Error('Failed to retrieve order');
            }

            // Ensure order exists
            if (!apiResponse.order) {
                console.error('No order found');
                return undefined;
            }

            // Pretty print the order
            console.log(JSON.stringify(apiResponse.order, null, 2));

            return apiResponse.order;
        } catch (error) {
            console.error('Error retrieving order:', error);
            process.exit(1);
        }
    }
}

// Optional: If you want to call the method
// GetOrder.execute().then(order => {
//     if (order) {
//         // Do something with the order
//     }
// });