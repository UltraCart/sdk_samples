import {orderApi} from '../api';
import {OrderReplacement, OrderReplacementItem, OrderReplacementResponse} from 'ultracart_rest_api_v2_typescript';

/*
 * The use-case for replacement() is to create another order for a customer to replace the items of the existing
 * order. For example, a merchant is selling perishable goods and the goods arrive late, spoiled. replacement()
 * helps to create another order to send more goods to the customer.
 *
 * You MUST supply the items you desire in the replacement order. This is done with the OrderReplacement.items field.
 * All options are displayed below including whether to charge the customer for this replacement order or not.
 */
export class Replacement {
    public static async execute(): Promise<void> {
        // Step 1. Replace the order
        const orderIdToReplace: string = "DEMO-0009104436";
        const replacementOptions: OrderReplacement = {
            original_order_id: orderIdToReplace,
            items: [
                {
                    merchant_item_id: "TSHIRT",
                    quantity: 1,
                    // arbitraryUnitCost: 9.99 // Commented out as in original
                },
                {
                    merchant_item_id: "BONE",
                    quantity: 2
                }
            ],
            // shippingMethod: "FedEx: Ground", // Commented out as in original
            immediate_charge: true,
            skip_payment: true,
            free: true,
            custom_field1: "Whatever",
            custom_field4: "More Whatever",
            additional_merchant_notes_new_order: "Replacement order for spoiled ice cream",
            additional_merchant_notes_original_order: "This order was replaced."
        };

        const apiResponse: OrderReplacementResponse = await orderApi.replacement({
            orderId: orderIdToReplace,
            replacement: replacementOptions
        });

        console.log(`Replacement Order: ${apiResponse.orderId}`);
        console.log(`Success flag: ${apiResponse.successful}`);
    }
}