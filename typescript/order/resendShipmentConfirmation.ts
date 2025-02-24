import { orderApi } from '../api';
import { BaseResponse } from 'ultracart_rest_api_v2_typescript';

/*
 * OrderApi.resendShipmentConfirmation() will resend (email) a shipment confirmation to a customer.
 */
export class ResendShipmentConfirmation {
    public static async execute(): Promise<void> {
        const orderId: string = "DEMO-0009104436";

        const apiResponse: BaseResponse = await orderApi.resendShipmentConfirmation({
            orderId: orderId
        });

        if (apiResponse.error !== undefined) {
            console.error(apiResponse.error.developer_message);
            console.error(apiResponse.error.user_message);
            console.log("Order could not be adjusted. See error log.");
            return;
        }

        if (apiResponse.success) {
            console.log("Shipment confirmation was resent.");
        } else {
            console.log("Failed to resend shipment confirmation.");
        }
    }
}