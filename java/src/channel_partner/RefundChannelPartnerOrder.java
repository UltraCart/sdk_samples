package channel_partner;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ultracart.admin.v2.ChannelPartnerApi;
import com.ultracart.admin.v2.models.Error;
import com.ultracart.admin.v2.models.Order;
import com.ultracart.admin.v2.models.OrderItem;
import com.ultracart.admin.v2.models.OrderResponse;

import java.util.List;

public class RefundChannelPartnerOrder {
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
    public static void execute() {
        try {
            // Create channel partner API instance
            ChannelPartnerApi channelPartnerApi = new ChannelPartnerApi(common.Constants.CHANNEL_PARTNER_API_KEY);

            // For a comment on this expansion, see getChannelPartnerOrder sample.
            String expansion = "item,summary,shipping";

            // This order MUST be an order associated with this channel partner, or you will receive a 400 Bad Request.
            String orderId = "DEMO-0009106820";
            OrderResponse apiResponse = channelPartnerApi.getChannelPartnerOrder(orderId, expansion);

            if (apiResponse.getError() != null) {
                System.err.println(apiResponse.getError());
                System.err.println(apiResponse.getError().getUserMessage());
                System.exit(1);
            }

            Order order = apiResponse.getOrder();

            // RefundReason may be required, but is optional by default.
            // RefundReason may be a set list, or may be freeform. This is configured on the backend (secure.ultracart.com)
            // by Navigating to Home -> Configuration -> Order Management -> Refund/Reject Reasons
            // Warning: If this is a 2nd refund after an initial partial refund, be sure you account for the units and amount already refunded.
            order.setRefundReason("Damage Product");
            order.getSummary().setTaxRefunded(order.getSummary().getTax());
            order.getSummary().setShippingHandlingRefunded(order.getSummary().getShippingHandlingTotal());

            List<OrderItem> items = order.getItems();
            for (OrderItem item : items) {
                // Item level refund reasons are optional, but may be required. See the above breadcrumb trail for refund reason config.
                item.setRefundReason("DifferentItem");
                item.setQuantityRefunded(item.getQuantity());
                item.setTotalRefunded(item.getTotalCostWithDiscount());
            }

            boolean rejectAfterRefund = false;
            boolean skipCustomerNotifications = true;
            boolean autoOrderCancel = false; // If this was an auto order, and they wanted to cancel it, set this flag to true.
            // Set manualRefund to true if the actual refund happened outside the system, and you just want a record of it.
            // If UltraCart did not process this refund, manualRefund should be true.
            boolean manualRefund = false;
            boolean reverseAffiliateTransactions = true; // For a full refund, the affiliate should not get credit, or should they?
            boolean issueStoreCredit = false; // If true, the customer would receive store credit instead of a return on their credit card.
            String autoOrderCancelReason = null;

            apiResponse = channelPartnerApi.refundChannelPartnerOrder(
                orderId,
                order,
                rejectAfterRefund,
                skipCustomerNotifications,
                autoOrderCancel,
                manualRefund,
                reverseAffiliateTransactions,
                issueStoreCredit,
                autoOrderCancelReason,
                expansion);

            Error error = apiResponse.getError();
            Order updatedOrder = apiResponse.getOrder();
            // Verify the updated order contains all the desired refunds. Verify that refunded total is equal to total.

            // Note: The error 'Request to refund an invalid amount.' means you requested a total refund amount less than or equal to zero.
            ObjectMapper mapper = new ObjectMapper();
            System.out.println("Error:");
            System.out.println(error != null ? mapper.writerWithDefaultPrettyPrinter().writeValueAsString(error) : "null");
            System.out.println("\n\n--------------------\n\n");
            System.out.println("Updated Order:");
            System.out.println(updatedOrder != null ? mapper.writerWithDefaultPrettyPrinter().writeValueAsString(updatedOrder) : "null");
        }
        catch (Exception ex) {
            System.out.println("Error: " + ex.getMessage());
            ex.printStackTrace();
        }
    }
}