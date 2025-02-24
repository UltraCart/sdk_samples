import {orderApi} from '../api';
import {BaseResponse} from 'ultracart_rest_api_v2_typescript';

/*
 * OrderApi.resendReceipt() will resend (email) a receipt to a customer.
 */
export class ResendReceipt {
    public static async execute(): Promise<void> {
        const orderId: string = "DEMO-0009104436";

        const apiResponse: BaseResponse = await orderApi.resendReceipt({
            orderId: orderId
        });

        if (apiResponse.error !== undefined) {
            console.error(apiResponse.error.developer_message);
            console.error(apiResponse.error.user_message);
            console.log("Order receipt could not be resent. See error log.");
            return;
        }

        if (apiResponse.success) {
            console.log("Receipt was resent.");
        } else {
            console.log("Failed to resend receipt.");
        }
    }
}