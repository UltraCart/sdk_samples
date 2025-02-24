import { orderApi } from '../api';
import { OrderRefundableResponse } from 'ultracart_rest_api_v2_typescript';

/**
 * isRefundable queries the UltraCart system whether an order is refundable or not.
 * In addition to a simple boolean response, UltraCart also returns back any reasons why
 * an order is not refundable.
 * Finally, the response also contains any refund or return reasons configured on the account in the event
 * that this merchant account is configured to require a reason for a return or refund.
 */
export class IsRefundableOrder {
    /**
     * Execute the refundable order check
     */
    public static async execute(): Promise<void> {
        const orderId = "DEMO-0009104976";

        try {
            const refundableResponse: OrderRefundableResponse = await orderApi.isRefundableOrder({
                orderId: orderId
            });

            console.log(`Is Refundable: ${refundableResponse.refundable}`);

            // the response contains dropdown values and additional information.  It's much more than a true/false flag.
            console.log("API Response:");
            console.log(JSON.stringify(refundableResponse, null, 2));
        } catch (error) {
            console.error("Error checking refundable status:", error);
        }
    }
}

