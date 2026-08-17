import {orderApi} from '../api.js';

/**
 * getOrderEmails returns the delivery records for every email UltraCart sent regarding an order,
 * oldest first.  Each record carries the subject and send time plus delivery, open, click and bounce
 * status, which makes this useful evidence that a customer was notified about their order.
 *
 * A customer profile is NOT required.  These records are tied to the order id itself.
 *
 * An order with no email history, or one whose emails were all suppressed, comes back with an empty
 * emails array.  That is a successful response rather than an error.
 *
 * The `internal` flag marks messages sent to merchant staff rather than to the customer.  Filter those
 * out if you only want what the customer actually received.
 *
 * Possible Errors:
 * order_id does not start with the merchant id -> "Path parameter 'order_id' does not start with the merchant id.  Check your parameter value and call log."
 */
export async function execute() {
    const orderId = "DEMO-0009104976";

    try {
        const response = await new Promise((resolve, reject) => {
            orderApi.getOrderEmails(
                orderId
                , function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
        });

        const emails = response.emails || [];

        if (emails.length === 0) {
            console.log('No emails were sent for this order.');
            return;
        }

        for (const email of emails) {
            console.log(email.send_dts + ' - ' + email.email + ' - ' + email.subject);

            const status = [];
            if (email.delivered) status.push('delivered ' + email.delivery_dts);
            if (email.opened) status.push('opened ' + email.opened_dts);
            if (email.clicked) status.push('clicked ' + email.clicked_dts);
            if (email.skipped) status.push('skipped: ' + email.skip_reason);
            if (email.bounce_type) status.push('bounced ' + email.bounce_type + '/' + email.bounce_sub_type);

            console.log('    ' + (status.length ? status.join(', ') : 'no delivery events recorded'));
        }
    } catch (error) {
        console.error('Error fetching order emails:', error);
    }
}
