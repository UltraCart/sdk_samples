using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.channel_partner
{
    public class RefundChannelPartnerOrderPartially
    {
        public static void Execute()
        {
            /*
             * IMPORTANT: Do NOT construct the refunded order.  This method does a refund but also update the entire object, so start with an order query.
             * ALWAYS start with an order retrieved from the system.
             * 1. Call getChannelPartnerOrder or getChannelPartnerOrderByChannelPartnerOrderId to retrieve the order being refunded
             * 2. For a partial refund, reverse the following:
             *    A. Set the refunded qty and refunded amount for each item.
             *    B. Set the refunded tax (if any)
             *    C. Set the refunded shipping (if any)
             *    D. As you refund an amount, aggregate that into a total.
             * NOTE: refund amounts are positive numbers.  If any item total cost is $20.00, a full refunded amount of that item would also be positive $20.00
             * See the ChannelPartnerApi.getChannelPartnerOrder() sample for details on that method.
            
            For this sample, I've created a test order of jewelry beads with the following items:
            You will need to create your own item to run this sample.
            
            rivoli_14mm_ab      4   Crystal Rivolis - Aurora Borealis Collection 14mm | Pack of 10      59.80
            rivoli_14mm_birth   6   Crystal Rivolis - Birthstone Collection 14mm | Pack of 14           125.70
            rivoli_14mm_colors  3   Crystal Rivoli Colorshift Collection - Crystal 14mm | Pack of 10    44.85
            rivoli_14mm_mystic  2   Crystal Rivolis - Mystic Collection 14mm | Pack of 12               47.90
            rivoli_14mm_opal    4   Crystal Rivolis - Opal Collection 14mm | Pack of 12                 107.80
            
                                                                            Subtotal                386.05
                                                                            Tax Rate                7.00%
                                                                            Tax                     27.02
                                                                            Shipping/Handling       10.70
                                                                            Gift Charge             2.95
                                                                            Total                   $426.72
            
            In this example, my customer wishes to refund all birth stones and two of the opal stones, so I'm going to refund
            the second and last items on this order.
            
            Steps:
            1) Fully refund the birth stones, quantity 6, cost 125.70.
            2) Partially refund the opal stones, quantity 2, cost 53.90
            3) Refund the appropriate tax.  7% tax for the refund item amount of 179.60 is a tax refund of 12.57
            4) Total (partial) refund will be 125.70 + 53.90 + 12.57 = 192.18
            
            There is no shipping refund for this example. The beads are small, light and only one box was being shipped.  So,
            for this example, I am not refunding any shipping.
             */

            ChannelPartnerApi channelPartnerApi = new ChannelPartnerApi(Constants.ChannelPartnerApiKey);
            // for a comment on this expansion, see getChannelPartnerOrder sample.
            // I don't need billing and shipping address for the refund, but I could need the shipping costs.
            // I'm not using coupons or gift_certificates
            string expansion = "item,summary,shipping,taxes,payment";

            // --------------------------------------------------------------------------------------------------
            // --------------------------------------------------------------------------------------------------
            // Step 1: Create my channel partner order.  To keep this simple, I'm just using a payment method of Purchase Order.
            // Note: This is a stripped down importOrder example.  See importChannelPartner sample for detailed fields.

            ChannelPartnerOrder cpOrder = new ChannelPartnerOrder();

            cpOrder.AssociateWithCustomerProfileIfPresent = true;
            cpOrder.AutoApprovePurchaseOrder = true;
            cpOrder.BilltoAddress1 = "11460 Johns Creek Parkway";
            cpOrder.BilltoAddress2 = "Suite 101";
            cpOrder.BilltoCity = "Duluth";
            cpOrder.BilltoCompany = "Widgets Inc";
            cpOrder.BilltoCountryCode = "US";
            cpOrder.BilltoDayPhone = "6784153823";
            cpOrder.BilltoEveningPhone = "6784154019";
            cpOrder.BilltoFirstName = "John";
            cpOrder.BilltoLastName = "Smith";
            cpOrder.BilltoPostalCode = "30097";
            cpOrder.BilltoStateRegion = "GA";
            cpOrder.BilltoTitle = "Sir";
            cpOrder.CcEmail = "orders@widgets.com";
            cpOrder.ChannelPartnerOrderId = "sdk-" + GenerateSecureRandomString();
            cpOrder.ConsiderRecurring = false;
            cpOrder.PaymentMethod = ChannelPartnerOrder.PaymentMethodEnum.PurchaseOrder;
            cpOrder.PurchaseOrderNumber = GenerateSecureRandomString();
            cpOrder.Email = "ceo@widgets.com";
            cpOrder.IpAddress = "34.125.95.217";

            // -- Items start ---
            ChannelPartnerOrderItem item1 = new ChannelPartnerOrderItem();
            item1.MerchantItemId = "rivoli_14mm_ab";
            item1.Quantity = 4;

            ChannelPartnerOrderItem item2 = new ChannelPartnerOrderItem();
            item2.MerchantItemId = "rivoli_14mm_birth";
            item2.Quantity = 6;

            ChannelPartnerOrderItem item3 = new ChannelPartnerOrderItem();
            item3.MerchantItemId = "rivoli_14mm_colors";
            item3.Quantity = 3;

            ChannelPartnerOrderItem item4 = new ChannelPartnerOrderItem();
            item4.MerchantItemId = "rivoli_14mm_mystic";
            item4.Quantity = 2;

            ChannelPartnerOrderItem item5 = new ChannelPartnerOrderItem();
            item5.MerchantItemId = "rivoli_14mm_opal";
            item5.Quantity = 4;

            cpOrder.Items = new List<ChannelPartnerOrderItem> { item1, item2, item3, item4, item5 };
            // -- Items End ---

            cpOrder.LeastCostRoute = true; // Give me the lowest cost shipping
            cpOrder.LeastCostRouteShippingMethods = new List<string> { "FedEx: Ground", "UPS: Ground", "USPS: Retail Ground" };
            cpOrder.MailingListOptIn = true; // Yes, I confirmed with the customer personally they wish to be on my mailing lists.
            cpOrder.ScreenBrandingThemeCode = "SF1986"; // Theme codes predated StoreFronts. Each StoreFront still has a theme code under the hood. We need that here. See this screen to find your code: https://secure.ultracart.com/merchant/configuration/customerServiceLoad.do
            cpOrder.ShipToResidential = true;
            cpOrder.ShiptoAddress1 = "55 Main Street";
            cpOrder.ShiptoAddress2 = "Suite 202";
            cpOrder.ShiptoCity = "Duluth";
            cpOrder.ShiptoCompany = "Widgets Inc";
            cpOrder.ShiptoCountryCode = "US";
            cpOrder.ShiptoDayPhone = "6785552323";
            cpOrder.ShiptoEveningPhone = "7703334444";
            cpOrder.ShiptoFirstName = "Sally";
            cpOrder.ShiptoLastName = "McGonkyDee";
            cpOrder.ShiptoPostalCode = "30097";
            cpOrder.ShiptoStateRegion = "GA";
            cpOrder.ShiptoTitle = "Director";
            cpOrder.SkipPaymentProcessing = false;
            cpOrder.SpecialInstructions = "Please wrap this in bubble wrap because my FedEx delivery guy is abusive to packages";
            cpOrder.StoreCompleted = false; // this will bypass everything, including shipping. useful only for importing old orders long completed
            cpOrder.StorefrontHostName = "store.mysite.com";
            cpOrder.StoreIfPaymentDeclines = false; // if payment fails, this can send it to Accounts Receivable. Do not want that. Fail if payment fails.
            cpOrder.TaxCounty = "Gwinnett";
            cpOrder.TaxExempt = false;
            cpOrder.TreatWarningsAsErrors = true;

            ChannelPartnerImportResponse apiResponse = channelPartnerApi.ImportChannelPartnerOrder(cpOrder);
            string orderId = apiResponse.OrderId;

            Console.WriteLine("Created sample order " + orderId);

            // --------------------------------------------------------------------------------------------------
            // --------------------------------------------------------------------------------------------------
            // Step 2: Refund my channel partner order.
            // This order MUST be an order associated with this channel partner, or you will receive a 400 Bad Request.
            // I'll need to get the order first, so I'm issuing another get to retrieve the order.
            // int orderId = 'DEMO-0009118954'; // <-- I created my order above, so I'll have the orderId from that response
            OrderResponse getResponse = channelPartnerApi.GetChannelPartnerOrder(orderId, expansion);

            if (getResponse.Error != null)
            {
                Console.Error.WriteLine(getResponse.Error.DeveloperMessage);
                Console.Error.WriteLine(getResponse.Error.UserMessage);
                return;
            }

            Order order = getResponse.Order;

            // RefundReason may be required, but is optional by default.
            // RefundReason may be a set list, or may be freeform. This is configured on the backend (secure.ultracart.com)
            // by Navigating to Home -> Configuration -> Order Management -> Refund/Reject Reasons
            // Warning: If this is a 2nd refund after an initial partial refund, be sure you account for the units and amount already refunded.
            order.RefundReason = "CustomerCancel";

            decimal itemAmountRefunded = 0;
            foreach (OrderItem item in order.Items)
            {
                Console.WriteLine("Examining itemIndex " + item.ItemIndex);
                Console.WriteLine("Item ID: " + item.MerchantItemId);

                // Fully refund all the birth stones.
                // I use string.Equals because the item ids will most likely return uppercase. Just to be sure, always do
                // string insensitive comparisons on item ids.
                if (string.Equals(item.MerchantItemId, "rivoli_14mm_birth", StringComparison.OrdinalIgnoreCase))
                {
                    // Refund reasons may be optional or required and must be on the configured list.
                    // See https://secure.ultracart.com/merchant/configuration/refundReasonLoad.do
                    // Home -> Configuration -> Order Management -> Refund/Reject Reasons
                    item.RefundReason = "DifferentItem";
                    item.QuantityRefunded = item.Quantity;
                    item.TotalRefunded = item.TotalCostWithDiscount;

                    itemAmountRefunded += item.TotalCostWithDiscount.Value;
                    Console.WriteLine("birthstones refund amount: " + item.TotalCostWithDiscount.Value);
                }

                // Refund two of the opals
                if (string.Equals(item.MerchantItemId, "rivoli_14mm_opal", StringComparison.OrdinalIgnoreCase))
                {
                    // Refund reasons may be optional or required and must be on the configured list.
                    // See https://secure.ultracart.com/merchant/configuration/refundReasonLoad.do
                    // Home -> Configuration -> Order Management -> Refund/Reject Reasons
                    item.RefundReason = "CustomerCancel";
                    item.QuantityRefunded = 2;

                    decimal totalCostOfTwoOpals = item.UnitCostWithDiscount.Value * 2;
                    item.TotalRefunded = new Currency(value: totalCostOfTwoOpals, currencyCode: "USD");

                    Console.WriteLine("opals refund amount: " + totalCostOfTwoOpals);
                    itemAmountRefunded += totalCostOfTwoOpals;
                }
            }

            decimal taxRate = order.Summary.Tax.Value / order.Summary.TaxableSubtotal.Value;
            decimal taxAmountRefunded = itemAmountRefunded * taxRate;
            Currency taxRefunded = new Currency(value: taxAmountRefunded, currencyCode: "USD");
            order.Summary.TaxRefunded = taxRefunded;

            decimal totalRefund = taxAmountRefunded + itemAmountRefunded;
            order.Summary.TotalRefunded = new Currency(value: totalRefund, currencyCode: "USD");

            Console.WriteLine("Item Refund Amount: " + itemAmountRefunded);
            Console.WriteLine("Calculated Tax Rate: " + taxRate);
            Console.WriteLine("Tax Refund Amount: " + taxAmountRefunded);
            Console.WriteLine("Total Refund Amount: " + totalRefund);

            bool rejectAfterRefund = false;
            bool skipCustomerNotifications = true;
            bool autoOrderCancel = false; // if this was an auto order, and they wanted to cancel it, set this flag to true.
            // set manualRefund to true if the actual refund happened outside the system, and you just want a record of it.
            // If UltraCart did not process this refund, manualRefund should be true.
            bool manualRefund = true; // IMPORTANT: Since my payment method is Purchase Order, I have to specify manual = true Or UltraCart will return a 400 Bad Request.
            bool reverseAffiliateTransactions = true; // for a full refund, the affiliate should not get credit, or should they?
            bool issueStoreCredit = false; // if true, the customer would receive store credit instead of a return on their credit card.
            string autoOrderCancelReason = null;

            OrderResponse refundResponse = channelPartnerApi.RefundChannelPartnerOrder(orderId, order, rejectAfterRefund,
                skipCustomerNotifications, autoOrderCancel, manualRefund, reverseAffiliateTransactions,
                issueStoreCredit, autoOrderCancelReason, expansion);

            Error error = refundResponse.Error;
            Order updatedOrder = refundResponse.Order;
            // verify the updated order contains all the desired refunds. verify that refunded total is equal to total.

            // Note: The error 'Request to refund an invalid amount.' means you requested a total refund amount less than or equal to zero.
            Console.WriteLine("Error:");
            Console.WriteLine(error);
            Console.WriteLine("Order:");
            Console.WriteLine(updatedOrder);
        }

        private static string GenerateSecureRandomString(int length = 10)
        {
            byte[] randomBytes = new byte[length / 2];
            using (RandomNumberGenerator rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomBytes);
            }
            return BitConverter.ToString(randomBytes).Replace("-", "").ToLower();
        }
    }
}