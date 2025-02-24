import { orderApi } from '../api.js';

/**
 * OrderApi.adjustOrderTotal() takes a desired order total and performs goal-seeking to adjust all items and taxes
 * appropriately.  This method was created for merchants dealing with Medicare and Medicaid.  When selling their
 * medical devices, they would often run into limits approved by Medicare.  As such, they needed to adjust the
 * order total to match the approved amount.  This is a convenience method to adjust individual items and their
 * taxes to match the desired total.
 */
export async function execute() {
    const orderId = "DEMO-0009104390";
    const desiredTotal = "21.99";

    try {
        const apiResponse = await new Promise((resolve, reject) => {
            orderApi.adjustOrderTotal(
                orderId,
                desiredTotal
            , function(error, data, response) {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            });
        });

        if (apiResponse.error) {
            console.error(apiResponse.error.developer_message);
            console.error(apiResponse.error.user_message);
            console.log("Order could not be adjusted. See error log.");
            return;
        }

        if (apiResponse.success) {
            console.log("Order was adjusted successfully. Use GetOrder() to retrieve the order if needed.");
        }
    } catch (error) {
        console.error("An error occurred while adjusting the order:", error);
    }
}