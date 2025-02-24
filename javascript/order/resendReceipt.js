import {orderApi} from '../api.js';

/*
 * OrderApi.resendReceipt() will resend (email) a receipt to a customer.
 */
export class ResendReceipt {
    static async execute() {
        const orderId = "DEMO-0009104436";

        const apiResponse = await new Promise((resolve, reject) => {
            orderApi.resendReceipt(
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