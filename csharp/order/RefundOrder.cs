using System;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;
using Newtonsoft.Json;

namespace SdkSample.order
{
    public class RefundOrder
    {
        /*
         * refundOrder() allows for both partial and complete refunds. Both are accomplished with the same steps.
         * 1) retrieve an order object using the SDK.
         * 2) input the refunded quantities for any or all items
         * 3) call refundOrder, passing in the modified object.
         * 4) To do a full refund, set all item refund quantities to their purchased quantities.
         *
         * This example will perform a full refund.
         */
        public static void Execute()
        {
            OrderApi orderApi = new OrderApi(Constants.ApiKey);

            // for the refund, I only need the items expanded to adjust their quantities.
            // See: https://www.ultracart.com/api/ for a list of all expansions.
            string expand = "items";

            // Step 1. Retrieve the order
            string orderId = "DEMO-0009104436";
            Order order = orderApi.GetOrder(orderId, expand).Order;

            foreach (OrderItem item in order.Items)
            {
                item.QuantityRefunded = item.Quantity;
            }

            bool rejectAfterRefund = false;
            bool skipCustomerNotification = true;
            bool cancelAssociatedAutoOrders = true; // does not matter for this sample. the order is not a recurring order.
            bool considerManualRefundDoneExternally = false; // no, I want an actual refund done through my gateway
            bool reverseAffiliateTransactions = true; // can't let my affiliates get money on a refunded order. bad business.
            bool issueStoreCredit = false;
            string autoCancelReason = null;

            OrderResponse apiResponse = orderApi.RefundOrder(
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

            Order refundedOrder = apiResponse.Order;

            // examine the subtotals and ensure everything was refunded correctly.
            Console.WriteLine(JsonConvert.SerializeObject(refundedOrder, new JsonSerializerSettings { Formatting = Formatting.Indented}));
        }
    }
}