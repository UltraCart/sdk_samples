import {orderApi} from '../api.js';

/*
 * refundOrder() allows for both partial and complete refunds. Both are accomplished with the same steps.
 * 1) retrieve an order object using the SDK.
 * 2) input the refunded quantities for any or all items
 * 3) call refundOrder, passing in the modified object.
 * 4) To do a full refund, set all item refund quantities to their purchased quantities.
 *
 * This example will perform a full refund.
 */
export class RefundOrder {
    static async execute() {
        // for the refund, I only need the items expanded to adjust their quantities.
        // See: https://www.ultracart.com/api/ for a list of all expansions.
        const expand = "items";

        // Step 1. Retrieve the order
        const orderId = "DEMO-0009104436";
        const orderResponse = await new Promise((resolve, reject) => {
            orderApi.getOrder(orderId,
                {
                    _expand: expand
                }, function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
        });

        const order = orderResponse.order;
        if (order) {
            for (const item of order.items) {
                item.quantity_refunded = item.quantity;
            }

            const rejectAfterRefund = false;
            const skipCustomerNotification = true;
            const cancelAssociatedAutoOrders = true; // does not matter for this sample. the order is not a recurring order.
            const considerManualRefundDoneExternally = false; // no, I want an actual refund done through my gateway
            const reverseAffiliateTransactions = true; // can't let my affiliates get money on a refunded order. bad business.
            const issueStoreCredit = false;
            const autoCancelReason = undefined;

            const apiResponse = await new Promise((resolve, reject) => {
                orderApi.refundOrder(
                    orderId,
                    order,
                    {
                        reject_after_refund: rejectAfterRefund,
                        skip_customer_notification: skipCustomerNotification,
                        auto_order_cancel: cancelAssociatedAutoOrders,
                        manual_refund: considerManualRefundDoneExternally,
                        reverse_affiliate_transactions: reverseAffiliateTransactions,
                        issue_store_credit: issueStoreCredit,
                        auto_order_cancel_reason: autoCancelReason,
                        _expand: expand
                    }, function (error, data, response) {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(data);
                        }
                    });
            });

            const refundedOrder = apiResponse.order;

            // examine the subtotals and ensure everything was refunded correctly.
            console.log(JSON.stringify(refundedOrder, null, 2));
        }
    }
}