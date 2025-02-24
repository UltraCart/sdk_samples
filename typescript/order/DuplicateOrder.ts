import { orderApi } from '../api';
import { 
    Order, 
    OrderItem, 
    Currency, 
    Weight, 
    OrderResponse, 
    OrderProcessPaymentRequest, 
    OrderProcessPaymentResponse 
} from 'ultracart_rest_api_v2_typescript';

/**
 * OrderApi.DuplicateOrder() does not accomplish much on its own. The use-case for this method is to
 * duplicate a customer's order and then charge them for it. DuplicateOrder() does not charge the customer again.
 *
 * These are the steps for cloning an existing order and charging the customer for it.
 * 1. DuplicateOrder
 * 2. UpdateOrder (if you wish to change any part of it)
 * 3. ProcessPayment to charge the customer.
 *
 * As a reminder, if you wish to create a new order from scratch, use the CheckoutApi or ChannelPartnerApi.
 * The OrderApi is for managing existing orders.
 */
export async function execute(): Promise<void> {
    try {
        // For this example, we're going to change the items after we duplicate the order, so
        // the only expansion properties we need are the items.
        // See: https://www.ultracart.com/api/ for a list of all expansions.
        const expansion = "items";

        // Step 1. Duplicate the order
        const orderIdToDuplicate = "DEMO-0009104436";
        const apiResponse: OrderResponse = await orderApi.duplicateOrder({
            orderId: orderIdToDuplicate,
            expand: expansion
        });
        const newOrder: Order = apiResponse.order!;

        // Step 2. Update the items. Create a new items array and assign it to the order to remove the old ones completely.
        const item: OrderItem = {
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

        newOrder.items = [item];
        const updateResponse: OrderResponse = await orderApi.updateOrder({
            orderId: newOrder.order_id!,
            order: newOrder,
            expand: expansion
        });

        const updatedOrder: Order = updateResponse.order!;

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

        const processPaymentRequest: OrderProcessPaymentRequest = {};
        const paymentResponse: OrderProcessPaymentResponse = await orderApi.processPayment({
            orderId: newOrder.order_id!,
            processPaymentRequest: processPaymentRequest
        });
        
        // do whatever you wish with this
        const transactionDetails = paymentResponse.payment_transaction;

        console.log("New Order (after updated items):");
        console.log(JSON.stringify(updatedOrder, null, 2));
        console.log("Payment Response:");
        console.log(JSON.stringify(paymentResponse, null, 2));
    } catch (error) {
        console.error("An error occurred while duplicating and processing the order:", error);
    }
}