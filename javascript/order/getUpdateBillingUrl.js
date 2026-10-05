import {orderApi} from '../api.js';

export class GetUpdateBillingUrl {
    /**
     * OrderApi.getUpdateBillingUrl() generates the url a customer can use to update the billing information
     * on the auto order associated with an order.  This is the same url sent in the auto order update billing email.
     *
     * Notes:
     * 1. The order must belong to an auto order, otherwise a 400 error is returned.
     * 2. Either the original order or any rebill order of the auto order may be used.
     * 3. Requires the order_write scope because the url carries a customer access token.
     *
     * If you have the auto_order_oid instead of an order id, see AutoOrderApi.getAutoOrderUpdateBillingUrl()
     */
    static async execute() {
        const orderId = 'DEMO-0009104436';

        try {
            const apiResponse = await new Promise((resolve, reject) => {
                orderApi.getUpdateBillingUrl(
                    orderId
                    , function (error, data, response) {
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
                throw new Error('Failed to generate update billing url');
            }

            // WARNING: The update billing url grants access to the customer's billing information.
            // Do not log it or expose it publicly in production.  It is printed here for demonstration only.
            console.log(`Update Billing Url: ${apiResponse.update_billing_url}`);

            return apiResponse.update_billing_url;
        } catch (error) {
            console.error('Error generating update billing url:', error);
            throw error;
        }
    }
}

// Optional: If you want to call the method
// GetUpdateBillingUrl.execute().then(url => {
//     // Send the url to the customer through a secure channel
// }).catch(error => {
//     // Handle any errors
// });
