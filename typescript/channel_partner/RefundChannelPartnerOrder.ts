import {
    ModelError,
    Order
} from 'ultracart_rest_api_v2_typescript';
import { channelPartnerApi } from '../api';

/**
 * IMPORTANT: Do NOT construct the refunded order. This method does a refund but also update the entire object, so start with an order query.
 * ALWAYS start with an order retrieved from the system.
 * 1. Call getChannelPartnerOrder or getChannelPartnerOrderByChannelPartnerOrderId to retrieve the order being refunded
 * 2. For a full refund, reverse the following:
 *    A. Set the refunded qty and refunded amount for each item.
 *    B. Set the refunded tax (if any)
 *    C. Set the refunded shipping
 * NOTE: refund amounts are positive numbers. If any item total cost is $20.00, a full refunded amount would also be positive $20.00
 * See the ChannelPartnerApi.getChannelPartnerOrder() sample for details on that method.
 */
export async function execute(): Promise<void> {
    try {
        // For a comment on this expand, see getChannelPartnerOrder sample.
        const expand: string = "item,summary,shipping";

        // This order MUST be an order associated with this channel partner, or you will receive a 400 Bad Request.
        const orderId: string = "DEMO-0009106820";

        // Retrieve the order
        const apiResponse = await channelPartnerApi.getChannelPartnerOrder({orderId, expand});

        // Check for errors
        if (apiResponse.error) {
            const error: ModelError = apiResponse.error;
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
        const order: Order = { ...apiResponse.order };

        // RefundReason may be required, but is optional by default.
        // RefundReason may be a set list, or may be freeform. This is configured on the backend (secure.ultracart.com)
        // by Navigating to Home -> Configuration -> Order Management -> Refund/Reject Reasons
        // Warning: If this is a 2nd refund after an initial partial refund, be sure you account for the units and amount already refunded.
        order.refund_reason = "Damage Product";

        // Ensure summary exists before modifying
        if (order.summary) {
            order.summary.tax_refunded = order.summary.tax;
            order.summary.shipping_handling_refunded = order.summary.shipping_handling_total;
        }

        // Modify items for refund
        if (order.items) {
            order.items.forEach(item => {
                // Item level refund reasons are optional, but may be required.
                // See the above breadcrumb trail for refund reason config.
                item.refund_reason = "DifferentItem";
                item.quantity_refunded = item.quantity;
                item.total_refunded = item.total_cost_with_discount;
            });
        }

        // Refund parameters
        const rejectAfterRefund: boolean = false;
        const skipCustomerNotification: boolean = true;
        const autoOrderCancel: boolean = false; // If this was an auto order, and they wanted to cancel it, set this flag to true.
        // Set manualRefund to true if the actual refund happened outside the system, and you just want a record of it.
        // If UltraCart did not process this refund, manualRefund should be true.
        const manualRefund: boolean = false;
        const reverseAffiliateTransactions: boolean = true; // For a full refund, the affiliate should not get credit, or should they?
        const issueStoreCredit: boolean = false; // If true, the customer would receive store credit instead of a return on their credit card.
        const autoOrderCancelReason: string | undefined = undefined;

        // Process the refund
        const refundResponse = await channelPartnerApi.refundChannelPartnerOrder({
            orderId,
            order,
            rejectAfterRefund,
            skipCustomerNotification,
            autoOrderCancel,
            manualRefund,
            reverseAffiliateTransactions,
            issueStoreCredit,
            autoOrderCancelReason,
            expand
        });

        // Log error and updated order
        const error: ModelError | undefined = refundResponse.error;
        const updatedOrder: Order | undefined = refundResponse.order;

        // Note: The error 'Request to refund an invalid amount.' means you requested a total refund amount less than or equal to zero.
        console.log("Error:");
        console.log(error ? JSON.stringify(error, null, 2) : "null");
        console.log("\n\n--------------------\n\n");
        console.log("Updated Order:");
        console.log(updatedOrder ? JSON.stringify(updatedOrder, null, 2) : "null");
    }
    catch (ex: unknown) {
        const error = ex as Error;
        console.error(`Error: ${error.message}`);
        console.error(error.stack);
    }
}

// Optional: If you want to run this directly
if (require.main === module) {
    execute().catch(console.error);
}