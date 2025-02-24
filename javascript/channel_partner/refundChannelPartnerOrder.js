import { channelPartnerApi } from '../api.js';

/**
 * IMPORTANT: Do NOT construct the refunded order. This method does a refund but also updates the entire object, so start with an order query.
 * ALWAYS start with an order retrieved from the system.
 * 1. Call getChannelPartnerOrder or getChannelPartnerOrderByChannelPartnerOrderId to retrieve the order being refunded
 * 2. For a full refund, reverse the following:
 *    A. Set the refunded qty and refunded amount for each item.
 *    B. Set the refunded tax (if any)
 *    C. Set the refunded shipping
 * NOTE: refund amounts are positive numbers. If any item total cost is $20.00, a full refunded amount would also be positive $20.00
 * See the ChannelPartnerApi.getChannelPartnerOrder() sample for details on that method.
 */
export async function execute() {
    try {
        // For a comment on this expand, see getChannelPartnerOrder sample.
        const expand = "item,summary,shipping";

        // This order MUST be an order associated with this channel partner, or you will receive a 400 Bad Request.
        const orderId = "DEMO-0009106820";

        // Retrieve the order
        const apiResponse = await new Promise((resolve, reject) => {
            channelPartnerApi.getChannelPartnerOrder(
                { orderId, expand },
                function (error, data) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                }
            );
        });

        // Check for errors
        if (apiResponse.error) {
            const error = apiResponse.error;
            console.error(error);
            console.error(error.user_message);
            process.exit(1);
        }

        // Ensure order exists
        if (!apiResponse.order) {
            console.error("No order found");
            process.exit(1);
        }

        // Create a copy of the order to modify
        const order = { ...apiResponse.order };

        // RefundReason may be required, but is optional by default.
        order.refund_reason = "Damage Product";

        // Ensure summary exists before modifying
        if (order.summary) {
            order.summary.tax_refunded = order.summary.tax;
            order.summary.shipping_handling_refunded = order.summary.shipping_handling_total;
        }

        // Modify items for refund
        if (order.items) {
            order.items.forEach(item => {
                item.refund_reason = "DifferentItem";
                item.quantity_refunded = item.quantity;
                item.total_refunded = item.total_cost_with_discount;
            });
        }

        // Refund parameters
        const rejectAfterRefund = false;
        const skipCustomerNotification = true;
        const autoOrderCancel = false;
        const manualRefund = false;
        const reverseAffiliateTransactions = true;
        const issueStoreCredit = false;
        const autoOrderCancelReason = undefined;

        // Process the refund
        const refundResponse = await new Promise((resolve, reject) => {
            channelPartnerApi.refundChannelPartnerOrder(
                    orderId,
                    order,
                {
                    reject_after_refund: rejectAfterRefund,
                    skip_customer_notification: skipCustomerNotification,
                    auto_order_cancel: autoOrderCancel,
                    manual_refund: manualRefund,
                    reverse_affiliate_transactions: reverseAffiliateTransactions,
                    issue_store_credit: issueStoreCredit,
                    auto_order_cancel_reason: autoOrderCancelReason,
                    _expand: expand
                },
                function (error, data) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                }
            );
        });

        // Log error and updated order
        const error = refundResponse.error;
        const updatedOrder = refundResponse.order;

        // Log error and updated order details
        console.log("Error:");
        console.log(error ? JSON.stringify(error, null, 2) : "null");
        console.log("\n\n--------------------\n\n");
        console.log("Updated Order:");
        console.log(updatedOrder ? JSON.stringify(updatedOrder, null, 2) : "null");
    } catch (ex) {
        const error = ex instanceof Error ? ex : new Error('Unknown error');
        console.error(`Error: ${error.message}`);
        console.error(error.stack);
    }
}

// Optional: If you want to run this directly
if (require.main === module) {
    execute().catch(console.error);
}
