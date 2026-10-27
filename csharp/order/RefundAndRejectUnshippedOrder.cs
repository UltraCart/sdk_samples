using System;
using System.Collections.Generic;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;
using Newtonsoft.Json;

namespace SdkSample.order
{
    public class RefundAndRejectUnshippedOrder
    {
        /*
         * Scenario: an order is paid and sitting in the Shipping Department.  The warehouse has not printed a label yet,
         * and the customer asks to cancel the order and get a full refund.
         *
         * The UltraCart part is a single call: RefundOrder() with reject_after_refund=true.  This is the API version of the
         * "Complete Refund (then reject)" button in the backend.  It refunds the order to the original payment method and
         * moves the order out of the Shipping Department into Rejected.  No separate cancel call is needed.
         *
         * Sequence:
         * 1) GetOrder()          - confirm the order is in the Shipping Department and has no tracking numbers.
         * 2) IsRefundableOrder() - confirm UltraCart will allow the refund.
         * 3) Cancel the order at your fulfillment provider.
         *    - Using ShipStation with "Cancel in ShipStation on Full Refund" set to Yes on the distribution center's
         *      transport mechanism?  Skip this step.  After the full refund in step 4, UltraCart automatically tells
         *      ShipStation to cancel the order.  Test this end to end on a test order before relying on it.  If ShipStation
         *      refuses (a label already exists), the refund has already happened.  UltraCart records the refusal as a
         *      warning in the distribution center log.
         *    - Otherwise, cancel the order at your fulfillment provider FIRST.  If it refuses because a label already
         *      exists, stop and do not refund.  This sample does not make that call.
         * 4) RefundOrder()       - full refund, then reject.
         *
         * Questions this sample answers:
         * - Will UltraCart re-send the order to the fulfillment center afterwards?  No.  An order is only retransmitted if
         *   someone moves it back into the Shipping Department with retransmit checked, or clicks Retransmit.
         * - Why not CancelOrder()?  CancelOrder() fails once an order is queued for or transmitted to a fulfillment center,
         *   which is the case for an order waiting in the Shipping Department.
         * - What about orders created by an auto order?  Pass auto_order_cancel=false and the auto order is left alone.
         *   Cancel the auto order separately if that is what the customer wants.
         */
        public static void Execute()
        {
            OrderApi orderApi = new OrderApi(Constants.ApiKey);

            string orderId = "DEMO-0009104436";

            // See: https://www.ultracart.com/api/ for a list of all expansions.
            string expand = "item,shipping,summary,auto_order";

            // Step 1. Retrieve the order and make sure it has not shipped.
            OrderResponse orderResponse = orderApi.GetOrder(orderId, expand);
            if (orderResponse.Error != null)
            {
                Console.Error.WriteLine(orderResponse.Error.DeveloperMessage);
                Console.Error.WriteLine(orderResponse.Error.UserMessage);
                return;
            }
            Order order = orderResponse.Order;

            if (order.CurrentStage != Order.CurrentStageEnum.ShippingDepartment)
            {
                Console.WriteLine($"Order is in stage '{order.CurrentStage}', not the Shipping Department.  Not refunding.");
                return;
            }
            List<string> trackingNumbers = order.Shipping?.TrackingNumbers;
            if (trackingNumbers != null && trackingNumbers.Count > 0)
            {
                Console.WriteLine($"Order already has tracking numbers {string.Join(", ", trackingNumbers)}.  Too late to cancel.");
                return;
            }
            if (order.AutoOrder != null)
            {
                Console.WriteLine($"Order belongs to auto order {order.AutoOrder.AutoOrderCode}.  The auto order will not be cancelled.");
            }

            // Step 2. Ask UltraCart whether the order can be refunded.
            OrderRefundableResponse refundableResponse = orderApi.IsRefundableOrder(orderId);
            if (refundableResponse.Refundable != true) // null should be treated as false
            {
                Console.WriteLine("Order is not refundable:");
                Console.WriteLine(JsonConvert.SerializeObject(refundableResponse, new JsonSerializerSettings { Formatting = Formatting.Indented }));
                return;
            }

            // Step 3. Unless ShipStation cancels the order for you (see the comment above), cancel it at your fulfillment provider here, before refunding.

            // Step 4. Mark everything as refunded.  These are TOTAL amounts (positive numbers), not deltas.
            // Warning: if this is a 2nd refund after an earlier partial refund, account for what was already refunded.
            // A refund reason may be required by your account.  It is configured at
            // Home -> Configuration -> Order Management -> Refund/Reject Reasons
            // order.RefundReason = "CustomerCancel";
            order.Summary.TaxRefunded = order.Summary.Tax;
            order.Summary.ShippingHandlingRefunded = order.Summary.ShippingHandlingTotal;
            foreach (OrderItem item in order.Items)
            {
                item.QuantityRefunded = item.Quantity;
                item.TotalRefunded = item.TotalCostWithDiscount;
            }

            bool rejectAfterRefund = true;             // moves the order out of the Shipping Department into Rejected
            bool skipCustomerNotification = false;     // let the customer know their refund is on the way
            bool autoOrderCancel = false;              // leave the auto order (if any) alone
            bool manualRefund = false;                 // refund through the payment gateway, to the original payment method
            bool reverseAffiliateTransactions = true;  // no affiliate commission on a cancelled order
            bool issueStoreCredit = false;             // money back, not store credit
            string autoOrderCancelReason = null;

            OrderResponse refundResponse = orderApi.RefundOrder(
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
            if (refundResponse.Error != null)
            {
                Console.Error.WriteLine(refundResponse.Error.DeveloperMessage);
                Console.Error.WriteLine(refundResponse.Error.UserMessage);
                return;
            }

            Order refundedOrder = refundResponse.Order;
            Console.WriteLine($"Current Stage: {refundedOrder.CurrentStage}"); // should be Rejected
            Console.WriteLine($"Total Refunded: {refundedOrder.Summary.TotalRefunded.Value}");
        }
    }
}
