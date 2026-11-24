package order;

import com.ultracart.admin.v2.OrderApi;
import com.ultracart.admin.v2.models.*;
import com.ultracart.admin.v2.util.ApiException;

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
public class RetryAccountsReceivableOrder {
    public static void execute() {
        OrderApi orderApi = new OrderApi(common.Constants.API_KEY);

        String orderId = "DEMO-0009104436";

        // Optional.  The code of an active rotating transaction gateway on your account, or null to let UltraCart choose.
        String rotatingTransactionGatewayCode = null; // change_me: e.g. "BACKUP_GATEWAY"

        // What to do if the retry is declined.  true rejects the order, false asks the customer to update their card.
        boolean giveUpIfDeclined = false;
        String rejectReason = "Card declined"; // Configured at Home -> Configuration -> Order Management -> Refund/Reject Reasons

        try {
            // Step 1. Make sure the order is still in Accounts Receivable.
            OrderResponse orderResponse = orderApi.getOrder(orderId, "auto_order");
            if (orderResponse.getError() != null) {
                System.err.println(orderResponse.getError().getDeveloperMessage());
                System.err.println(orderResponse.getError().getUserMessage());
                return;
            }
            Order order = orderResponse.getOrder();

            if (order.getCurrentStage() != Order.CurrentStageEnum.ACCOUNTS_RECEIVABLE) {
                System.out.println("Order is in stage '" + order.getCurrentStage() + "', not Accounts Receivable.  Nothing to do.");
                return;
            }
            if (order.getAutoOrder() != null) {
                System.out.println("Order belongs to auto order " + order.getAutoOrder().getAutoOrderCode() + ".  The retry is sent as a recurring charge.");
            }

            // Step 2. Retry the charge.
            OrderProcessPaymentRequest processPaymentRequest = new OrderProcessPaymentRequest();
            if (rotatingTransactionGatewayCode != null) {
                processPaymentRequest.setRotatingTransactionGatewayCode(rotatingTransactionGatewayCode);
            }

            OrderProcessPaymentResponse paymentResponse = orderApi.processPayment(orderId, processPaymentRequest);
            OrderPaymentTransaction transaction = paymentResponse.getPaymentTransaction();

            if (transaction == null) {
                // No charge was attempted.  For example, the gateway code is not an active gateway on the account.
                String reason = paymentResponse.getError() != null ? paymentResponse.getError().getUserMessage() : "unknown reason";
                System.out.println("Payment was not attempted: " + reason);
                return;
            }

            String gatewayUsed = null;
            if (transaction.getDetails() != null) {
                for (OrderPaymentTransactionDetail detail : transaction.getDetails()) {
                    if ("rotatingTransactionGatewayCode".equals(detail.getName())) {
                        gatewayUsed = detail.getValue();
                    }
                }
            }
            System.out.println("Charge attempted through " + transaction.getTransactionGateway() + " (rotating gateway " + gatewayUsed + ")");

            if (Boolean.TRUE.equals(paymentResponse.getSuccess())) {
                System.out.println("Payment succeeded.  The order has moved out of Accounts Receivable.");
                return;
            }

            System.out.println("Payment was declined.");

            // Step 3. The retry was declined.
            if (giveUpIfDeclined) {
                // Step 3b. Reject the order.  The customer is not emailed, and an auto order rebill keeps its auto order.
                OrderCancelRequest cancelRequest = new OrderCancelRequest();
                cancelRequest.setRejectReason(rejectReason);
                BaseResponse cancelResponse = orderApi.cancelOrderWithOptions(orderId, cancelRequest);
                if (Boolean.TRUE.equals(cancelResponse.getSuccess())) {
                    System.out.println("Order was rejected.");
                } else {
                    String reason = cancelResponse.getError() != null ? cancelResponse.getError().getUserMessage() : "unknown reason";
                    System.out.println("Order could not be rejected: " + reason);
                }
            } else {
                // Step 3a. Ask the customer to update their billing information.  Throws an ApiException (HTTP 400) with
                // the reason if UltraCart will not send it, for example if it was already sent through the API in the last 24 hours.
                BaseResponse emailResponse = orderApi.sendUpdateBillingEmail(orderId);
                if (Boolean.TRUE.equals(emailResponse.getSuccess())) {
                    System.out.println("Update billing email was queued.");
                }
            }
        } catch (ApiException e) {
            System.out.println("An ApiException occurred.  Please review the following error:");
            System.out.println(e.getCode() + " " + e.getResponseBody());
        }
    }
}
