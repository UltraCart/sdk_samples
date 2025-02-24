import {orderApi} from '../api';
import {Order, OrderItem, OrderResponse} from 'ultracart_rest_api_v2_typescript';
import {DateTime} from 'luxon';

/*
 * refundOrder() allows for both partial and complete refunds. Both are accomplished with the same steps.
 * 1) retrieve an order object using the SDK.
 * 2) input the refunded quantities for any or all items
 * 3) call refundOrder, passing in the modified object.
 * 4) To do a full refund, set all item refund quantities to their purchased quantities.
 *
 * This example will perform a full refund.
 */
export class RefundOrder {
    public static async execute(): Promise<void> {
        // for the refund, I only need the items expanded to adjust their quantities.
        // See: https://www.ultracart.com/api/ for a list of all expansions.
        const expand: string = "items";

        // Step 1. Retrieve the order
        const orderId: string = "DEMO-0009104436";
        const orderOrUndefined: Order | undefined = (await orderApi.getOrder({orderId, expand})).order;
        if (orderOrUndefined !== undefined) {
            const order = orderOrUndefined as Order;


            for (const item of order.items as OrderItem[]) {
                item.quantity_refunded = item.quantity;
            }

            const rejectAfterRefund: boolean = false;
            const skipCustomerNotification: boolean = true;
            const cancelAssociatedAutoOrders: boolean = true; // does not matter for this sample. the order is not a recurring order.
            const considerManualRefundDoneExternally: boolean = false; // no, I want an actual refund done through my gateway
            const reverseAffiliateTransactions: boolean = true; // can't let my affiliates get money on a refunded order. bad business.
            const issueStoreCredit: boolean = false;
            const autoCancelReason: string | undefined = undefined;

            const apiResponse: OrderResponse = await orderApi.refundOrder({
                orderId: orderId,
                order: order,
                rejectAfterRefund: rejectAfterRefund,
                skipCustomerNotification: skipCustomerNotification,
                autoOrderCancel: cancelAssociatedAutoOrders,
                manualRefund: considerManualRefundDoneExternally,
                reverseAffiliateTransactions: reverseAffiliateTransactions,
                issueStoreCredit: issueStoreCredit,
                autoOrderCancelReason: autoCancelReason,
                expand: expand
            });

            const refundedOrder: Order | undefined = apiResponse.order;

            // examine the subtotals and ensure everything was refunded correctly.
            console.log(JSON.stringify(refundedOrder, null, 2));
        }
    }
}