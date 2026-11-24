import {orderApi} from '../api.js';

/*
 * Scenario: you run your own Accounts Receivable retry process instead of UltraCart's Accounts Receivable Retry service.
 * A customer's card was declined (for example on an auto order rebill) and the order is sitting in Accounts Receivable.
 * Your process decides, order by order, whether to retry the charge, ask the customer to update their billing
 * information, or give up and reject the order.
 *
 * Sequence:
 * 1) getOrder()                 - confirm the order is still in Accounts Receivable.
 * 2) processPayment()           - retry the charge.  Optionally pick the gateway with rotating_transaction_gateway_code.
 * 3) If the retry is declined, either:
 *    a) sendUpdateBillingEmail()   - email the customer a link to update their card, or
 *    b) cancelOrderWithOptions()   - give up and reject the order, with a reject reason.
 *
 * Questions this sample answers:
 * - Is an API retry of an auto order rebill sent to the gateway as a recurring transaction?  Yes.  processPayment()
 *   flags the charge as recurring whenever the order belongs to an auto order, the same as UltraCart's retry service.
 * - Can I choose the gateway?  Yes, with rotating_transaction_gateway_code on the process payment request.  It must be
 *   an active rotating transaction gateway on the account.  The charge is attempted on that gateway only, with no
 *   cascade to your other gateways, the same as choosing a gateway on the Accounts Receivable Process Payment screen.
 *   If the gateway does not support the card type, UltraCart's normal gateway selection is used; the transaction
 *   details show which gateway processed the charge.
 * - Does rejecting the order cancel the customer's auto order?  Not for a rebill.  A rejected rebill leaves the auto
 *   order active, so it rebills on its next cycle.  Rejecting the auto order's original order cancels the auto order.
 * - Does the customer get an email when the order is rejected?  No.
 * - How often can I send the update billing email?  Once per order per 24 hours through the API.  While the order is
 *   less than 7 days old, UltraCart also sends a reminder every 2 days on its own.
 *
 * Requires SDK 4.1.260 or later.
 */
export class RetryAccountsReceivableOrder {
    static async execute() {
        const orderId = "DEMO-0009104436";

        // Optional.  The code of an active rotating transaction gateway on your account, or null to let UltraCart choose.
        const rotatingTransactionGatewayCode = null; // change_me: e.g. "BACKUP_GATEWAY"

        // What to do if the retry is declined.  true rejects the order, false asks the customer to update their card.
        const giveUpIfDeclined = false;
        const rejectReason = "Card declined"; // Configured at Home -> Configuration -> Order Management -> Refund/Reject Reasons

        // Wrap the callback style API in a promise.
        const call = (fn) => new Promise((resolve, reject) => {
            fn(function (error, data, response) {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            });
        });

        try {
            // Step 1. Make sure the order is still in Accounts Receivable.
            const orderResponse = await call(cb => orderApi.getOrder(orderId, {_expand: "auto_order"}, cb));
            if (orderResponse.error) {
                console.error('Developer Message:', orderResponse.error.developer_message);
                console.error('User Message:', orderResponse.error.user_message);
                return;
            }
            const order = orderResponse.order;

            if (order.current_stage !== 'Accounts Receivable') {
                console.log(`Order is in stage '${order.current_stage}', not Accounts Receivable.  Nothing to do.`);
                return;
            }
            if (order.auto_order) {
                console.log(`Order belongs to auto order ${order.auto_order.auto_order_code}.  The retry is sent as a recurring charge.`);
            }

            // Step 2. Retry the charge.
            const processPaymentRequest = {};
            if (rotatingTransactionGatewayCode) {
                processPaymentRequest.rotating_transaction_gateway_code = rotatingTransactionGatewayCode;
            }

            const paymentResponse = await call(cb => orderApi.processPayment(orderId, processPaymentRequest, cb));
            const transaction = paymentResponse.payment_transaction;

            if (!transaction) {
                // No charge was attempted.  For example, the gateway code is not an active gateway on the account.
                console.log(`Payment was not attempted: ${paymentResponse.error?.user_message}`);
                return;
            }

            const gatewayUsed = (transaction.details || []).find(d => d.name === 'rotatingTransactionGatewayCode')?.value;
            console.log(`Charge attempted through ${transaction.transaction_gateway} (rotating gateway ${gatewayUsed})`);

            if (paymentResponse.success) {
                console.log('Payment succeeded.  The order has moved out of Accounts Receivable.');
                return;
            }

            console.log('Payment was declined.');

            // Step 3. The retry was declined.
            if (giveUpIfDeclined) {
                // Step 3b. Reject the order.  The customer is not emailed, and an auto order rebill keeps its auto order.
                const cancelResponse = await call(cb => orderApi.cancelOrderWithOptions(orderId, {reject_reason: rejectReason}, cb));
                if (cancelResponse.success) {
                    console.log('Order was rejected.');
                } else {
                    console.log(`Order could not be rejected: ${cancelResponse.error?.user_message}`);
                }
            } else {
                // Step 3a. Ask the customer to update their billing information.  Fails with HTTP 400 and the reason
                // if UltraCart will not send it, for example if it was already sent through the API in the last 24 hours.
                const emailResponse = await call(cb => orderApi.sendUpdateBillingEmail(orderId, cb));
                if (emailResponse.success) {
                    console.log('Update billing email was queued.');
                }
            }
        } catch (error) {
            console.error('Error processing Accounts Receivable order:', error.response ? error.response.text : error);
        }
    }
}

// Optional: If you want to call the method
// RetryAccountsReceivableOrder.execute().then(() => {}).catch(error => console.error(error));
