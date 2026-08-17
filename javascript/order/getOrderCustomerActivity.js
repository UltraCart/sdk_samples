import {orderApi} from '../api.js';

/**
 * getOrderCustomerActivity returns the customer activity associated with the email address on an order.
 * This includes email engagement history, email list and segment membership, lifetime metrics and email
 * suppression status.
 *
 * A customer profile is NOT required and is not consulted.  The activity is keyed off the email address
 * on the order, so this works for guest orders that have never had a customer profile established.  For
 * the page views captured during the session that placed the order, use getOrderPageViewHistory instead.
 *
 * If the order has no valid email address, email and customer_activity both come back null.  That is a
 * successful response rather than an error - without an email there is no activity record to find.
 *
 * Note: activity.ts is a unix timestamp in milliseconds, not an ISO 8601 string like most dates in this API.
 *
 * Possible Errors:
 * order_id does not start with the merchant id -> "Path parameter 'order_id' does not start with the merchant id.  Check your parameter value and call log."
 */
export async function execute() {
    const orderId = "DEMO-0009104976";

    try {
        const response = await new Promise((resolve, reject) => {
            orderApi.getOrderCustomerActivity(
                orderId
                , function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
        });

        console.log('Customer activity for: ' + response.email);

        const customerActivity = response.customer_activity;

        if (!customerActivity) {
            console.log('No customer activity found for this order.');
            return;
        }

        console.log('Globally unsubscribed: ' + customerActivity.global_unsubscribed);
        console.log('Spam complaint: ' + customerActivity.spam_complaint);

        const activities = customerActivity.activities || [];

        for (const activity of activities) {
            console.log(new Date(activity.ts).toISOString()
                + ' - ' + activity.type
                + ' - ' + activity.action
                + (activity.subject ? ' - ' + activity.subject : ''));
        }
    } catch (error) {
        console.error('Error fetching customer activity:', error);
    }
}
