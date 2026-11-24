import {orderApi} from '../api';
import {
    BaseResponse,
    Order,
    OrderCurrentStageEnum,
    OrderPaymentTransaction,
    OrderProcessPaymentRequest,
    OrderProcessPaymentResponse,
    OrderResponse
} from 'ultracart_rest_api_v2_typescript';

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
 *   Use this for soft declines and gateway outages.  Re-running a hard decline (stolen card, closed account, do not
 *   honor) on another gateway can violate card network retry rules.
 * - Does rejecting the order cancel the customer's auto order?  Not for a rebill.  A rejected rebill leaves the auto
 *   order active, so it rebills on its next cycle.  Rejecting the auto order's original order cancels the auto order.
 * - Does the customer get an email when the order is rejected?  No.
 * - How often can I send the update billing email?  Once per order per 24 hours through the API.  While the order is
 *   less than 7 days old, UltraCart also sends a reminder every 2 days on its own.
 *
 * Requires SDK 4.1.260 or later.
 */
export class RetryAccountsReceivableOrder {
    public static async execute(): Promise<void> {
        const orderId: string = "DEMO-0009104436";

        // Optional.  The code of an active rotating transaction gateway on your account, or undefined to let UltraCart choose.
        const rotatingTransactionGatewayCode: string | undefined = undefined; // change_me: e.g. "BACKUP_GATEWAY"

        // What to do if the retry is declined.  true rejects the order, false asks the customer to update their card.
        const giveUpIfDeclined: boolean = false;
        const rejectReason: string = "Card declined"; // Configured at Home -> Configuration -> Order Management -> Refund/Reject Reasons

        try {
            // Step 1. Make sure the order is still in Accounts Receivable.
            const orderResponse: OrderResponse = await orderApi.getOrder({orderId, expand: "auto_order"});
            if (orderResponse.error) {
                console.error('Developer Message:', orderResponse.error.developer_message);
                console.error('User Message:', orderResponse.error.user_message);
                return;
            }
            const order: Order = orderResponse.order as Order;

            if (order.current_stage !== OrderCurrentStageEnum.AccountsReceivable) {
                console.log(`Order is in stage '${order.current_stage}', not Accounts Receivable.  Nothing to do.`);
                return;
            }
            if (order.auto_order) {
                console.log(`Order belongs to auto order ${order.auto_order.auto_order_code}.  The retry is sent as a recurring charge.`);
            }

            // Step 2. Retry the charge.
            const processPaymentRequest: OrderProcessPaymentRequest = {};
            if (rotatingTransactionGatewayCode) {
                processPaymentRequest.rotating_transaction_gateway_code = rotatingTransactionGatewayCode;
            }

            const paymentResponse: OrderProcessPaymentResponse = await orderApi.processPayment({orderId, processPaymentRequest});
            const transaction: OrderPaymentTransaction | undefined = paymentResponse.payment_transaction;

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
                const cancelResponse: BaseResponse = await orderApi.cancelOrderWithOptions({
                    orderId,
                    cancelRequest: {reject_reason: rejectReason}
                });
                if (cancelResponse.success) {
                    console.log('Order was rejected.');
                } else {
                    console.log(`Order could not be rejected: ${cancelResponse.error?.user_message}`);
                }
            } else {
                // Step 3a. Ask the customer to update their billing information.  Throws a ResponseError (HTTP 400) with
                // the reason if UltraCart will not send it, for example if it was already sent through the API in the last 24 hours.
                const emailResponse: BaseResponse = await orderApi.sendUpdateBillingEmail({orderId});
                if (emailResponse.success) {
                    console.log('Update billing email was queued.');
                }
            }
        } catch (error) {
            console.error('Error processing Accounts Receivable order:', error);
        }
    }
}
