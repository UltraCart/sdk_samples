import {orderApi} from '../api.js';

/*
 * Scenario: an order is paid and sitting in the Shipping Department.  The warehouse has not printed a label yet,
 * and the customer asks to cancel the order and get a full refund.
 *
 * The UltraCart part is a single call: refundOrder() with reject_after_refund=true.  This is the API version of the
 * "Complete Refund (then reject)" button in the backend.  It refunds the order to the original payment method and
 * moves the order out of the Shipping Department into Rejected.  No separate cancel call is needed.
 *
 * Sequence:
 * 1) getOrder()          - confirm the order is in the Shipping Department and has no tracking numbers.
 * 2) isRefundableOrder() - confirm UltraCart will allow the refund.
 * 3) Cancel the order at your fulfillment provider.
 *    - Using ShipStation with "Cancel in ShipStation on Full Refund" set to Yes on the distribution center's
 *      transport mechanism?  Skip this step.  After the full refund in step 4, UltraCart automatically tells
 *      ShipStation to cancel the order.  Test this end to end on a test order before relying on it.  If ShipStation
 *      refuses (a label already exists), the refund has already happened.  UltraCart records the refusal as a
 *      warning in the distribution center log.
 *    - Otherwise, cancel the order at your fulfillment provider FIRST.  If it refuses because a label already
 *      exists, stop and do not refund.  This sample does not make that call.
 * 4) refundOrder()       - full refund, then reject.
 *
 * Questions this sample answers:
 * - Will UltraCart re-send the order to the fulfillment center afterwards?  No.  An order is only retransmitted if
 *   someone moves it back into the Shipping Department with retransmit checked, or clicks Retransmit.
 * - Why not cancelOrder()?  cancelOrder() fails once an order is queued for or transmitted to a fulfillment center,
 *   which is the case for an order waiting in the Shipping Department.
 * - What about orders created by an auto order?  Pass auto_order_cancel=false and the auto order is left alone.
 *   Cancel the auto order separately if that is what the customer wants.
 */
export class RefundAndRejectUnshippedOrder {
    static async execute() {
        const orderId = "DEMO-0009104436";

        // See: https://www.ultracart.com/api/ for a list of all expansions.
        const expand = "item,shipping,summary,auto_order";

        try {
            // Step 1. Retrieve the order and make sure it has not shipped.
            const orderResponse = await new Promise((resolve, reject) => {
                orderApi.getOrder(orderId, {_expand: expand}, function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            if (orderResponse.error) {
                console.error('Developer Message:', orderResponse.error.developer_message);
                console.error('User Message:', orderResponse.error.user_message);
                return;
            }
            const order = orderResponse.order;

            if (order.current_stage !== 'Shipping Department') {
                console.log(`Order is in stage '${order.current_stage}', not the Shipping Department.  Not refunding.`);
                return;
            }
            if (order.shipping && order.shipping.tracking_numbers && order.shipping.tracking_numbers.length > 0) {
                console.log(`Order already has tracking numbers ${order.shipping.tracking_numbers}.  Too late to cancel.`);
                return;
            }
            if (order.auto_order) {
                console.log(`Order belongs to auto order ${order.auto_order.auto_order_code}.  The auto order will not be cancelled.`);
            }

            // Step 2. Ask UltraCart whether the order can be refunded.
            const refundableResponse = await new Promise((resolve, reject) => {
                orderApi.isRefundableOrder(orderId, function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            if (!refundableResponse.refundable) { // null should be treated as false
                console.log('Order is not refundable:');
                console.log(JSON.stringify(refundableResponse, null, 2));
                return;
            }

            // Step 3. Unless ShipStation cancels the order for you (see the comment above), cancel it at your fulfillment provider here, before refunding.

            // Step 4. Mark everything as refunded.  These are TOTAL amounts (positive numbers), not deltas.
            // Warning: if this is a 2nd refund after an earlier partial refund, account for what was already refunded.
            // A refund reason may be required by your account.  It is configured at
            // Home -> Configuration -> Order Management -> Refund/Reject Reasons
            // order.refund_reason = "CustomerCancel";
            if (order.summary) {
                order.summary.tax_refunded = order.summary.tax;
                order.summary.shipping_handling_refunded = order.summary.shipping_handling_total;
            }
            for (const item of order.items || []) {
                item.quantity_refunded = item.quantity;
                item.total_refunded = item.total_cost_with_discount;
            }

            const refundResponse = await new Promise((resolve, reject) => {
                orderApi.refundOrder(
                    orderId,
                    order,
                    {
                        reject_after_refund: true,             // moves the order out of the Shipping Department into Rejected
                        skip_customer_notification: false,     // let the customer know their refund is on the way
                        auto_order_cancel: false,              // leave the auto order (if any) alone
                        manual_refund: false,                  // refund through the payment gateway, to the original payment method
                        reverse_affiliate_transactions: true,  // no affiliate commission on a cancelled order
                        issue_store_credit: false,             // money back, not store credit
                        _expand: "item,summary"
                    }, function (error, data, response) {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(data);
                        }
                    });
            });

            // "Request to refund an invalid amount." means the refund total came out as zero or less.
            if (refundResponse.error) {
                console.error('Developer Message:', refundResponse.error.developer_message);
                console.error('User Message:', refundResponse.error.user_message);
                return;
            }

            const refundedOrder = refundResponse.order;
            console.log(`Current Stage: ${refundedOrder.current_stage}`); // should be Rejected
            console.log(`Total Refunded: ${refundedOrder.summary?.total_refunded?.value}`);
        } catch (error) {
            console.error('Error refunding and rejecting order:', error);
        }
    }
}

// Optional: If you want to call the method
// RefundAndRejectUnshippedOrder.execute().then(() => {}).catch(error => console.error(error));
