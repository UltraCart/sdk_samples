package order;

import com.ultracart.admin.v2.OrderApi;
import com.ultracart.admin.v2.models.*;
import com.ultracart.admin.v2.util.ApiException;

import java.util.List;

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
public class RefundAndRejectUnshippedOrder {
    public static void execute() throws ApiException {
        OrderApi orderApi = new OrderApi(common.Constants.API_KEY);

        String orderId = "DEMO-0009104436";

        // See: https://www.ultracart.com/api/ for a list of all expansions.
        String expand = "item,shipping,summary,auto_order";

        // Step 1. Retrieve the order and make sure it has not shipped.
        OrderResponse orderResponse = orderApi.getOrder(orderId, expand);
        if (orderResponse.getError() != null) {
            System.err.println(orderResponse.getError().getDeveloperMessage());
            System.err.println(orderResponse.getError().getUserMessage());
            return;
        }
        Order order = orderResponse.getOrder();

        if (order.getCurrentStage() != Order.CurrentStageEnum.SHIPPING_DEPARTMENT) {
            System.out.println("Order is in stage '" + order.getCurrentStage() + "', not the Shipping Department.  Not refunding.");
            return;
        }
        List<String> trackingNumbers = order.getShipping() != null ? order.getShipping().getTrackingNumbers() : null;
        if (trackingNumbers != null && !trackingNumbers.isEmpty()) {
            System.out.println("Order already has tracking numbers " + trackingNumbers + ".  Too late to cancel.");
            return;
        }
        if (order.getAutoOrder() != null) {
            System.out.println("Order belongs to auto order " + order.getAutoOrder().getAutoOrderCode() + ".  The auto order will not be cancelled.");
        }

        // Step 2. Ask UltraCart whether the order can be refunded.
        OrderRefundableResponse refundableResponse = orderApi.isRefundableOrder(orderId);
        if (!Boolean.TRUE.equals(refundableResponse.getRefundable())) { // null should be treated as false
            System.out.println("Order is not refundable:");
            System.out.println(refundableResponse);
            return;
        }

        // Step 3. Unless ShipStation cancels the order for you (see the comment above), cancel it at your fulfillment provider here, before refunding.

        // Step 4. Mark everything as refunded.  These are TOTAL amounts (positive numbers), not deltas.
        // Warning: if this is a 2nd refund after an earlier partial refund, account for what was already refunded.
        // A refund reason may be required by your account.  It is configured at
        // Home -> Configuration -> Order Management -> Refund/Reject Reasons
        // order.setRefundReason("CustomerCancel");
        order.getSummary().setTaxRefunded(order.getSummary().getTax());
        order.getSummary().setShippingHandlingRefunded(order.getSummary().getShippingHandlingTotal());
        for (OrderItem item : order.getItems()) {
            item.setQuantityRefunded(item.getQuantity());
            item.setTotalRefunded(item.getTotalCostWithDiscount());
        }

        boolean rejectAfterRefund = true;             // moves the order out of the Shipping Department into Rejected
        boolean skipCustomerNotification = false;     // let the customer know their refund is on the way
        boolean autoOrderCancel = false;              // leave the auto order (if any) alone
        boolean manualRefund = false;                 // refund through the payment gateway, to the original payment method
        boolean reverseAffiliateTransactions = true;  // no affiliate commission on a cancelled order
        boolean issueStoreCredit = false;             // money back, not store credit
        String autoOrderCancelReason = null;

        OrderResponse refundResponse = orderApi.refundOrder(
            orderId,
            order,
            rejectAfterRefund,
            skipCustomerNotification,
            autoOrderCancel,
            manualRefund,
            reverseAffiliateTransactions,
            issueStoreCredit,
            autoOrderCancelReason,
            "item,summary"
        );

        // "Request to refund an invalid amount." means the refund total came out as zero or less.
        if (refundResponse.getError() != null) {
            System.err.println(refundResponse.getError().getDeveloperMessage());
            System.err.println(refundResponse.getError().getUserMessage());
            return;
        }

        Order refundedOrder = refundResponse.getOrder();
        System.out.println("Current Stage: " + refundedOrder.getCurrentStage()); // should be Rejected
        System.out.println("Total Refunded: " + refundedOrder.getSummary().getTotalRefunded().getValue());
    }
}
