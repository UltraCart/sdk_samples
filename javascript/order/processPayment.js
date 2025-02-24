import {orderApi} from '../api.js';

class ProcessPayment {
    /*
     * OrderApi.processPayment() was designed to charge a customer for an order. It was created to work in tandem with
     * duplicateOrder(), which does not accomplish payment on its own. The use-case for this method is to
     * duplicate a customer's order and then charge them for it. duplicateOrder() does not charge the customer again,
     * which is why processPayment() exists.
     *
     * These are the steps for cloning an existing order and charging the customer for it.
     * 1. duplicateOrder
     * 2. updateOrder (if you wish to change any part of it)
     * 3. processPayment to charge the customer.
     *
     * As a reminder, if you wish to create a new order from scratch, use the CheckoutApi or ChannelPartnerApi.
     * The OrderApi is for managing existing orders.
     */
    static async execute() {
        const expansion = "items";   // for this example, we're going to change the items after we duplicate the order, so
                                     // the only expansion properties we need are the items.
                                     // See: https://www.ultracart.com/api/  for a list of all expansions.

        // Step 1. Duplicate the order
        const orderIdToDuplicate = "DEMO-0009104436";
        const apiResponse = await new Promise((resolve, reject) => {
            orderApi.duplicateOrder(
                orderIdToDuplicate, {
                    _expand: expansion
                }, function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
        });
        const newOrder = apiResponse.order;

        if (!newOrder) {
            throw new Error("Order duplication failed");
        }

        // Step 2. Update the items. I will create a new items list and assign it to the order to remove the old ones completely.
        const items = [];
        const item = {
            merchant_item_id: "simple_teapot",
            quantity: 1,
            description: "A lovely teapot",
            distribution_center_code: "DFLT", // where is this item shipping out of?

            cost: {
                currency_code: "USD",
                value: 9.99
            },

            weight: {
                uom: "OZ",
                value: 6
            }
        };

        items.push(item);
        newOrder.items = items;
        const updateResponse = await new Promise((resolve, reject) => {
            orderApi.updateOrder(
                newOrder.order_id,
                newOrder,
                {
                    _expand: expansion
                }, function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
        });

        const updatedOrder = updateResponse.order;

        // Step 3. process the payment.
        // the request object below takes two optional arguments.
        // The first is an amount if you wish to bill for an amount different from the order.
        // We do not bill differently in this example.
        // The second is card_verification_number_token, which is a token you can create by using our hosted fields to
        // upload a CVV value. This will create a token you may use here. However, most merchants using the duplicate
        // order method will be setting up an auto order for a customer. Those will not make use of the CVV, so we're
        // not including it here. That is why the request object below is does not have any values set.
        // For more info on hosted fields:
        // See: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377775/UltraCart+Hosted+Credit+Card+Fields
        // See: https://github.com/UltraCart/sdk_samples/blob/master/hosted_fields/hosted_fields.html

        const processPaymentRequest = {};
        const paymentResponse = await new Promise((resolve, reject) => {
            orderApi.processPayment(
                newOrder.order_id,
                processPaymentRequest
                , function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
        });
        const transactionDetails = paymentResponse.payment_transaction; // do whatever you wish with this.

        console.log("New Order (after updated items):");
        this.displayOrderInfo(updatedOrder);
        console.log("\nPayment Response:");
        this.displayPaymentResponse(paymentResponse);
    }

    static displayOrderInfo(order) {
        if (!order) {
            console.log("No order information available");
            return;
        }

        console.log(`Order ID: ${order.order_id}`);
        console.log(`Total: ${order.summary?.total?.value} ${order.summary?.total?.currency_code}`);
        console.log("Items:");

        order.items?.forEach(item => {
            console.log(`  - ${item.quantity}x ${item.description} (${item.merchant_item_id})`);
            console.log(`    Cost: ${item.cost?.value} ${item.cost?.currency_code}`);
        });
    }

    static displayPaymentResponse(response) {
        console.log(`Successfully Processed: ${response.success}`);

        if (response.payment_transaction) {
            console.log(`Transaction ID: ${response.payment_transaction.transaction_id}`);
            console.log(`Transaction Timestamp: ${response.payment_transaction.transaction_timestamp}`);
        }

        // here's the entire object:
        console.log(JSON.stringify(response, null, 2));

        if (response.error) {
            console.log(`Error: ${response.error.user_message}`);
        }
    }
}

export default ProcessPayment;