import { orderApi } from '../api.js';

/*
 * OrderApi.resendShipmentConfirmation() will resend (email) a shipment confirmation to a customer.
 */
export class ResendShipmentConfirmation {
    static async execute() {
        const orderId = "DEMO-0009104436";

        const apiResponse = await new Promise((resolve, reject) => {
            orderApi.resendShipmentConfirmation(
                orderId
            , function (error, data, response) {
                if (error) {
                    reject(error);
                } else {
                    resolve(data, response);
                }
            });
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