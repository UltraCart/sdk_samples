using System;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Client;
using com.ultracart.admin.v2.Model;

namespace SdkSample.order
{
    public class CancelOrderWithOptions
    {
        /*
         * OrderApi.CancelOrderWithOptions() cancels an order, the same as CancelOrder(), with the options in a request body.
         * An empty OrderCancelRequest behaves exactly like CancelOrder().
         *
         * Options:
         * - reject_reason:          stored on the order when it is rejected without a refund (Accounts Receivable, Pre-order,
         *                           Quote or Hold), the same as the reject reason in the backend.  Reasons are configured at
         *                           Home -> Configuration -> Order Management -> Refund/Reject Reasons
         * - lock_self_ship_orders:  prevent the order from shipping during the refund process
         * - skip_refund_and_hold:   skip the refund and move the order to the Held Orders department
         *
         * Rejecting an order in Accounts Receivable:
         * - The customer is not emailed.
         * - A rejected auto order rebill leaves the auto order active, so it rebills on its next cycle.
         * - Rejecting the auto order's original order cancels the auto order, because the first payment never succeeded.
         *
         * Restrictions (the same as CancelOrder()):
         * 1) Cannot cancel completed orders
         * 2) Cannot cancel already rejected orders
         * 3) Cannot cancel orders transmitted to fulfillment center
         * 4) Cannot cancel orders queued for distribution center transmission
         *
         * Requires SDK 4.1.260 or later.
         */
        public static void Execute()
        {
            OrderApi orderApi = new OrderApi(Constants.ApiKey);

            string orderId = "DEMO-0009104436";

            OrderCancelRequest cancelRequest = new OrderCancelRequest
            {
                RejectReason = "Card declined"
            };

            try
            {
                BaseResponse apiResponse = orderApi.CancelOrderWithOptions(orderId, cancelRequest);

                if (apiResponse.Error != null)
                {
                    Console.Error.WriteLine(apiResponse.Error.DeveloperMessage);
                    Console.Error.WriteLine(apiResponse.Error.UserMessage);
                    Console.WriteLine("Order could not be canceled.");
                    return;
                }

                if (apiResponse.Success == true)
                {
                    Console.WriteLine("Order was canceled successfully.");
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
