package order;

import com.ultracart.admin.v2.OrderApi;
import com.ultracart.admin.v2.models.BaseResponse;
import com.ultracart.admin.v2.models.OrderCancelRequest;
import com.ultracart.admin.v2.util.ApiException;

/*
 * OrderApi.cancelOrderWithOptions() cancels an order, the same as cancelOrder(), with the options in a request body.
 * An empty OrderCancelRequest behaves exactly like cancelOrder().
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
 * Restrictions (the same as cancelOrder()):
 * 1) Cannot cancel completed orders
 * 2) Cannot cancel already rejected orders
 * 3) Cannot cancel orders transmitted to fulfillment center
 * 4) Cannot cancel orders queued for distribution center transmission
 *
 * Requires SDK 4.1.260 or later.
 */
public class CancelOrderWithOptions {
    public static void execute() {
        OrderApi orderApi = new OrderApi(common.Constants.API_KEY);

        String orderId = "DEMO-0009104436";

        OrderCancelRequest cancelRequest = new OrderCancelRequest();
        cancelRequest.setRejectReason("Card declined");

        try {
            BaseResponse apiResponse = orderApi.cancelOrderWithOptions(orderId, cancelRequest);

            if (apiResponse.getError() != null) {
                System.err.println(apiResponse.getError().getDeveloperMessage());
                System.err.println(apiResponse.getError().getUserMessage());
                System.out.println("Order could not be canceled.");
                return;
            }

            if (Boolean.TRUE.equals(apiResponse.getSuccess())) {
                System.out.println("Order was canceled successfully.");
            }
        } catch (ApiException e) {
            System.out.println("An ApiException occurred.  Please review the following error:");
            System.out.println(e.getCode() + " " + e.getResponseBody());
        }
    }
}
