using System;
using System.Linq;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Client;
using com.ultracart.admin.v2.Model;

namespace SdkSample.order
{
    public class RetryAccountsReceivableOrder
    {
        /*
         * Scenario: you run your own Accounts Receivable retry process instead of UltraCart's Accounts Receivable Retry service.
         * A customer's card was declined (for example on an auto order rebill) and the order is sitting in Accounts Receivable.
         * Your process decides, order by order, whether to retry the charge, ask the customer to update their billing
         * information, or give up and reject the order.
         *
         * Sequence:
         * 1) GetOrder()                 - confirm the order is still in Accounts Receivable.
         * 2) ProcessPayment()           - retry the charge.  Optionally pick the gateway with rotating_transaction_gateway_code.
         * 3) If the retry is declined, either:
         *    a) SendUpdateBillingEmail()   - email the customer a link to update their card, or
         *    b) CancelOrderWithOptions()   - give up and reject the order, with a reject reason.
         *
         * Questions this sample answers:
         * - Is an API retry of an auto order rebill sent to the gateway as a recurring transaction?  Yes.  ProcessPayment()
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
        public static void Execute()
        {
            OrderApi orderApi = new OrderApi(Constants.ApiKey);

            string orderId = "DEMO-0009104436";

            // Optional.  The code of an active rotating transaction gateway on your account, or null to let UltraCart choose.
            string rotatingTransactionGatewayCode = null; // change_me: e.g. "BACKUP_GATEWAY"

            // What to do if the retry is declined.  true rejects the order, false asks the customer to update their card.
            bool giveUpIfDeclined = false;
            string rejectReason = "Card declined"; // Configured at Home -> Configuration -> Order Management -> Refund/Reject Reasons

            try
            {
                // Step 1. Make sure the order is still in Accounts Receivable.
                OrderResponse orderResponse = orderApi.GetOrder(orderId, "auto_order");
                if (orderResponse.Error != null)
                {
                    Console.Error.WriteLine(orderResponse.Error.DeveloperMessage);
                    Console.Error.WriteLine(orderResponse.Error.UserMessage);
                    return;
                }
                Order order = orderResponse.Order;

                if (order.CurrentStage != Order.CurrentStageEnum.AccountsReceivable)
                {
                    Console.WriteLine($"Order is in stage '{order.CurrentStage}', not Accounts Receivable.  Nothing to do.");
                    return;
                }
                if (order.AutoOrder != null)
                {
                    Console.WriteLine($"Order belongs to auto order {order.AutoOrder.AutoOrderCode}.  The retry is sent as a recurring charge.");
                }

                // Step 2. Retry the charge.
                OrderProcessPaymentRequest processPaymentRequest = new OrderProcessPaymentRequest();
                if (rotatingTransactionGatewayCode != null)
                {
                    processPaymentRequest.RotatingTransactionGatewayCode = rotatingTransactionGatewayCode;
                }

                OrderProcessPaymentResponse paymentResponse = orderApi.ProcessPayment(orderId, processPaymentRequest);
                OrderPaymentTransaction transaction = paymentResponse.PaymentTransaction;

                if (transaction == null)
                {
                    // No charge was attempted.  For example, the gateway code is not an active gateway on the account.
                    Console.WriteLine($"Payment was not attempted: {paymentResponse.Error?.UserMessage}");
                    return;
                }

                string gatewayUsed = transaction.Details?.FirstOrDefault(d => d.Name == "rotatingTransactionGatewayCode")?.Value;
                Console.WriteLine($"Charge attempted through {transaction.TransactionGateway} (rotating gateway {gatewayUsed})");

                if (paymentResponse.Success == true)
                {
                    Console.WriteLine("Payment succeeded.  The order has moved out of Accounts Receivable.");
                    return;
                }

                Console.WriteLine("Payment was declined.");

                // Step 3. The retry was declined.
                if (giveUpIfDeclined)
                {
                    // Step 3b. Reject the order.  The customer is not emailed, and an auto order rebill keeps its auto order.
                    OrderCancelRequest cancelRequest = new OrderCancelRequest { RejectReason = rejectReason };
                    BaseResponse cancelResponse = orderApi.CancelOrderWithOptions(orderId, cancelRequest);
                    if (cancelResponse.Success == true)
                    {
                        Console.WriteLine("Order was rejected.");
                    }
                    else
                    {
                        Console.WriteLine($"Order could not be rejected: {cancelResponse.Error?.UserMessage}");
                    }
                }
                else
                {
                    // Step 3a. Ask the customer to update their billing information.  Throws an ApiException (HTTP 400) with
                    // the reason if UltraCart will not send it, for example if it was already sent through the API in the last 24 hours.
                    BaseResponse emailResponse = orderApi.SendUpdateBillingEmail(orderId);
                    if (emailResponse.Success == true)
                    {
                        Console.WriteLine("Update billing email was queued.");
                    }
                }
            }
            catch (ApiException e)
            {
                Console.WriteLine("An ApiException occurred.  Please review the following error:");
                Console.WriteLine($"{e.ErrorCode} {e.ErrorContent}");
            }
        }
    }
}
