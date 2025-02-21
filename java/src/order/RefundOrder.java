package order;

import com.ultracart.admin.v2.OrderApi;
import com.ultracart.admin.v2.models.*;
import com.ultracart.admin.v2.util.ApiException;

/*
 * refundOrder() allows for both partial and complete refunds. Both are accomplished with the same steps.
 * 1) retrieve an order object using the SDK.
 * 2) input the refunded quantities for any or all items
 * 3) call refundOrder, passing in the modified object.
 * 4) To do a full refund, set all item refund quantities to their purchased quantities.
 *
 * This example will perform a full refund.
 */
public class RefundOrder {
    public static void execute() throws ApiException {
        OrderApi orderApi = new OrderApi(common.Constants.API_KEY);

        // for the refund, I only need the items expanded to adjust their quantities.
        // See: https://www.ultracart.com/api/ for a list of all expansions.
        String expand = "items";

        // Step 1. Retrieve the order
        String orderId = "DEMO-0009104436";
        Order order = orderApi.getOrder(orderId, expand).getOrder();

        for (OrderItem item : order.getItems()) {
            item.setQuantityRefunded(item.getQuantity());
        }

        boolean rejectAfterRefund = false;
        boolean skipCustomerNotification = true;
        boolean cancelAssociatedAutoOrders = true; // does not matter for this sample. the order is not a recurring order.
        boolean considerManualRefundDoneExternally = false; // no, I want an actual refund done through my gateway
        boolean reverseAffiliateTransactions = true; // can't let my affiliates get money on a refunded order. bad business.
        boolean issueStoreCredit = false;
        String autoCancelReason = null;

        OrderResponse apiResponse = orderApi.refundOrder(
            orderId,
            order,
            rejectAfterRefund,
            skipCustomerNotification,
            cancelAssociatedAutoOrders,
            considerManualRefundDoneExternally,
            reverseAffiliateTransactions,
            issueStoreCredit,
            autoCancelReason,
            expand
        );

        Order refundedOrder = apiResponse.getOrder();

        // examine the subtotals and ensure everything was refunded correctly.
        System.out.println(refundedOrder.toString());
    }
}