using System;
using System.Collections.Generic;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;
using Newtonsoft.Json;

namespace SdkSample.channel_partner
{
    public class RefundChannelPartnerOrder
    {
        /// <summary>
        /// IMPORTANT: Do NOT construct the refunded order. This method does a refund but also update the entire object, so start with an order query.
        /// ALWAYS start with an order retrieved from the system.
        /// 1. Call getChannelPartnerOrder or getChannelPartnerOrderByChannelPartnerOrderId to retrieve the order being refunded
        /// 2. For a full refund, reverse the following:
        ///    A. Set the refunded qty and refunded amount for each item.
        ///    B. Set the refunded tax (if any)
        ///    C. Set the refunded shipping
        /// NOTE: refund amounts are positive numbers. If any item total cost is $20.00, a full refunded amount would also be positive $20.00
        /// See the ChannelPartnerApi.getChannelPartnerOrder() sample for details on that method.
        /// </summary>
        public void Execute()
        {
            // Create channel partner API instance
            ChannelPartnerApi channelPartnerApi = new ChannelPartnerApi(Constants.ChannelPartnerApiKey);
            
            // For a comment on this expansion, see getChannelPartnerOrder sample.
            string expansion = "item,summary,shipping";
            
            // This order MUST be an order associated with this channel partner, or you will receive a 400 Bad Request.
            string orderId = "DEMO-0009106820";
            OrderResponse apiResponse = channelPartnerApi.GetChannelPartnerOrder(orderId, expansion);

            if (apiResponse.Error != null)
            {
                Console.Error.WriteLine(apiResponse.Error);
                Console.Error.WriteLine(apiResponse.Error.UserMessage);
                Environment.Exit(1);
            }

            Order order = apiResponse.Order;

            // RefundReason may be required, but is optional by default.
            // RefundReason may be a set list, or may be freeform. This is configured on the backend (secure.ultracart.com)
            // by Navigating to Home -> Configuration -> Order Management -> Refund/Reject Reasons
            // Warning: If this is a 2nd refund after an initial partial refund, be sure you account for the units and amount already refunded.
            order.RefundReason = "Damage Product";
            order.Summary.TaxRefunded = order.Summary.TaxRefunded;
            order.Summary.ShippingHandlingRefunded = order.Summary.ShippingHandlingTotal;
            
            foreach (OrderItem item in order.Items)
            {
                // Item level refund reasons are optional, but may be required. See the above breadcrumb trail for refund reason config.
                item.RefundReason = "DifferentItem";
                item.QuantityRefunded = item.Quantity;
                item.TotalRefunded = item.TotalCostWithDiscount;
            }

            bool rejectAfterRefund = false;
            bool skipCustomerNotifications = true;
            bool autoOrderCancel = false; // If this was an auto order, and they wanted to cancel it, set this flag to true.
            // Set manualRefund to true if the actual refund happened outside the system, and you just want a record of it.
            // If UltraCart did not process this refund, manualRefund should be true.
            bool manualRefund = false;
            bool reverseAffiliateTransactions = true; // For a full refund, the affiliate should not get credit, or should they?
            bool issueStoreCredit = false; // If true, the customer would receive store credit instead of a return on their credit card.
            string autoOrderCancelReason = null;

            apiResponse = channelPartnerApi.RefundChannelPartnerOrder(
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

            Error error = apiResponse.Error;
            Order updatedOrder = apiResponse.Order;
            // Verify the updated order contains all the desired refunds. Verify that refunded total is equal to total.

            // Note: The error 'Request to refund an invalid amount.' means you requested a total refund amount less than or equal to zero.
            Console.WriteLine("Error:");
            Console.WriteLine(error != null ? JsonConvert.SerializeObject(error, Formatting.Indented) : "null");
            Console.WriteLine("\n\n--------------------\n\n");
            Console.WriteLine("Updated Order:");
            Console.WriteLine(updatedOrder != null ? JsonConvert.SerializeObject(updatedOrder, Formatting.Indented) : "null");
        }
    }
}