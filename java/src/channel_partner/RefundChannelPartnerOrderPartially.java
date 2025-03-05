package channel_partner;

import com.ultracart.admin.v2.ChannelPartnerApi;
import com.ultracart.admin.v2.models.Error;
import com.ultracart.admin.v2.models.*;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.HashMap;

// IMPORTANT: Do NOT construct the refunded order. This method does a refund but also update the entire object, so start with an order query.
// ALWAYS start with an order retrieved from the system.
// 1. Call getChannelPartnerOrder or getChannelPartnerOrderByChannelPartnerOrderId to retrieve the order being refunded
// 2. For a partial refund, reverse the following:
//    A. Set the refunded qty and refunded amount for each item.
//    B. Set the refunded tax (if any)
//    C. Set the refunded shipping (if any)
//    D. As you refund an amount, aggregate that into a total.
// NOTE: refund amounts are positive numbers. If any item total cost is $20.00, a full refunded amount of that item would also be positive $20.00
// See the ChannelPartnerApi.getChannelPartnerOrder() sample for details on that method.

// For this sample, I've created a test order of jewelry beads with the following items:
// You will need to create your own item to run this sample.
//
// rivoli_14mm_ab      4   Crystal Rivolis - Aurora Borealis Collection 14mm | Pack of 10      59.80
// rivoli_14mm_birth   6   Crystal Rivolis - Birthstone Collection 14mm | Pack of 14           125.70
// rivoli_14mm_colors  3   Crystal Rivoli Colorshift Collection - Crystal 14mm | Pack of 10    44.85
// rivoli_14mm_mystic  2   Crystal Rivolis - Mystic Collection 14mm | Pack of 12               47.90
// rivoli_14mm_opal    4   Crystal Rivolis - Opal Collection 14mm | Pack of 12                 107.80
//
//                                                                     Subtotal                386.05
//                                                                     Tax Rate                7.00%
//                                                                     Tax                     27.02
//                                                                     Shipping/Handling       10.70
//                                                                     Gift Charge             2.95
//                                                                     Total                   $426.72
//
// In this example, my customer wishes to refund all birth stones and two of the opal stones, so I'm going to refund
// the second and last items on this order.
//
// Steps:
// 1) Fully refund the birth stones, quantity 6, cost 125.70.
// 2) Partially refund the opal stones, quantity 2, cost 53.90
// 3) Refund the appropriate tax. 7% tax for the refund item amount of 179.60 is a tax refund of 12.57
// 4) Total (partial) refund will be 125.70 + 53.90 + 12.57 = 192.18
//
// There is no shipping refund for this example. The beads are small, light and only one box was being shipped. So,
// for this example, I am not refunding any shipping.

public class RefundChannelPartnerOrderPartially {

    public static String generateSecureRandomString(int length) {
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[length / 2];
        random.nextBytes(bytes);
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }

    public void refundChannelPartnerOrder() throws ApiException {
        ChannelPartnerApi channelPartnerApi = new ChannelPartnerApi(Constants.API_KEY);
        // for a comment on this expansion, see getChannelPartnerOrder sample.
        // I don't need billing and shipping address for the refund, but I could need the shipping costs.
        // I'm not using coupons or gift_certificates
        String expansion = "item,summary,shipping,taxes,payment";

        // --------------------------------------------------------------------------------------------------
        // --------------------------------------------------------------------------------------------------
        // Step 1: Create my channel partner order. To keep this simple, I'm just using a payment method of Purchase Order.
        // Note: This is a stripped down importOrder example. See importChannelPartner sample for detailed fields.

        ChannelPartnerOrder cpOrder = new ChannelPartnerOrder();

        cpOrder.setAssociateWithCustomerProfileIfPresent(true);
        cpOrder.setAutoApprovePurchaseOrder(true);
        cpOrder.setBilltoAddress1("11460 Johns Creek Parkway");
        cpOrder.setBilltoAddress2("Suite 101");
        cpOrder.setBilltoCity("Duluth");
        cpOrder.setBilltoCompany("Widgets Inc");
        cpOrder.setBilltoCountryCode("US");
        cpOrder.setBilltoDayPhone("6784153823");
        cpOrder.setBilltoEveningPhone("6784154019");
        cpOrder.setBilltoFirstName("John");
        cpOrder.setBilltoLastName("Smith");
        cpOrder.setBilltoPostalCode("30097");
        cpOrder.setBilltoStateRegion("GA");
        cpOrder.setBilltoTitle("Sir");
        cpOrder.setCcEmail("orders@widgets.com");
        cpOrder.setChannelPartnerOrderId("sdk-" + generateSecureRandomString(10));
        cpOrder.setConsiderRecurring(false);
        cpOrder.setPaymentMethod(ChannelPartnerOrder.PaymentMethodEnum.PURCHASE_ORDER);
        cpOrder.setPurchaseOrderNumber(generateSecureRandomString(10));
        cpOrder.setEmail("ceo@widgets.com");
        cpOrder.setIpAddress("34.125.95.217");

        // -- Items start ---
        ChannelPartnerOrderItem item1 = new ChannelPartnerOrderItem();
        item1.setMerchantItemId("rivoli_14mm_ab");
        item1.setQuantity(BigDecimal.valueOf(4));

        ChannelPartnerOrderItem item2 = new ChannelPartnerOrderItem();
        item2.setMerchantItemId("rivoli_14mm_birth");
        item2.setQuantity(BigDecimal.valueOf(6));

        ChannelPartnerOrderItem item3 = new ChannelPartnerOrderItem();
        item3.setMerchantItemId("rivoli_14mm_colors");
        item3.setQuantity(BigDecimal.valueOf(3));

        ChannelPartnerOrderItem item4 = new ChannelPartnerOrderItem();
        item4.setMerchantItemId("rivoli_14mm_mystic");
        item4.setQuantity(BigDecimal.valueOf(2));

        ChannelPartnerOrderItem item5 = new ChannelPartnerOrderItem();
        item5.setMerchantItemId("rivoli_14mm_opal");
        item5.setQuantity(BigDecimal.valueOf(4));

        ArrayList<ChannelPartnerOrderItem> items = new ArrayList<>();
        items.add(item1);
        items.add(item2);
        items.add(item3);
        items.add(item4);
        items.add(item5);
        cpOrder.setItems(items);
        // -- Items End ---

        cpOrder.setLeastCostRoute(true); // Give me the lowest cost shipping
        ArrayList<String> leastCostRouteShippingMethods = new ArrayList<>();
        leastCostRouteShippingMethods.add("FedEx: Ground");
        leastCostRouteShippingMethods.add("UPS: Ground");
        leastCostRouteShippingMethods.add("USPS: Retail Ground");
        cpOrder.setLeastCostRouteShippingMethods(leastCostRouteShippingMethods);
        cpOrder.setMailingListOptIn(true); // Yes, I confirmed with the customer personally they wish to be on my mailing lists.
        cpOrder.setScreenBrandingThemeCode("SF1986"); // Theme codes predated StoreFronts. Each StoreFront still has a theme code under the hood. We need that here. See this screen to find your code: https://secure.ultracart.com/merchant/configuration/customerServiceLoad.do
        cpOrder.setShipToResidential(true);
        cpOrder.setShiptoAddress1("55 Main Street");
        cpOrder.setShiptoAddress2("Suite 202");
        cpOrder.setShiptoCity("Duluth");
        cpOrder.setShiptoCompany("Widgets Inc");
        cpOrder.setShiptoCountryCode("US");
        cpOrder.setShiptoDayPhone("6785552323");
        cpOrder.setShiptoEveningPhone("7703334444");
        cpOrder.setShiptoFirstName("Sally");
        cpOrder.setShiptoLastName("McGonkyDee");
        cpOrder.setShiptoPostalCode("30097");
        cpOrder.setShiptoStateRegion("GA");
        cpOrder.setShiptoTitle("Director");
        cpOrder.setSkipPaymentProcessing(false);
        cpOrder.setSpecialInstructions("Please wrap this in bubble wrap because my FedEx delivery guy is abusive to packages");
        cpOrder.setStoreCompleted(false); // this will bypass everything, including shipping. useful only for importing old orders long completed
        cpOrder.setStorefrontHostName("store.mysite.com");
        cpOrder.setStoreIfPaymentDeclines(false); // if payment fails, this can send it to Accounts Receivable. Do not want that. Fail if payment fails.
        cpOrder.setTaxCounty("Gwinnett");
        cpOrder.setTaxExempt(false);
        cpOrder.setTreatWarningsAsErrors(true);

        ChannelPartnerImportResponse apiResponse = channelPartnerApi.importChannelPartnerOrder(cpOrder);
        String orderId = apiResponse.getOrderId();

        System.out.println("Created sample order " + orderId);

        // --------------------------------------------------------------------------------------------------
        // --------------------------------------------------------------------------------------------------
        // Step 2: Refund my channel partner order.
        // This order MUST be an order associated with this channel partner, or you will receive a 400 Bad Request.
        // I'll need to get the order first, so I'm issuing another get to retrieve the order.
        // orderId = "DEMO-0009118954"; // <-- I created my order above, so I'll have the order_id from that response
        OrderResponse getResponse = channelPartnerApi.getChannelPartnerOrder(orderId, expansion);

        if (getResponse.getError() != null) {
            System.out.println(getResponse.getError().getDeveloperMessage());
            System.out.println(getResponse.getError().getUserMessage());
            return;
        }

        Order order = getResponse.getOrder();

        // System.out.println(order.toString());
        // System.out.println("\n\n");

        // RefundReason may be required, but is optional by default.
        // RefundReason may be a set list, or may be freeform. This is configured on the backend (secure.ultracart.com)
        // by Navigating to Home -> Configuration -> Order Management -> Refund/Reject Reasons
        // Warning: If this is a 2nd refund after an initial partial refund, be sure you account for the units and amount already refunded.
        order.setRefundReason("CustomerCancel");

        BigDecimal itemAmountRefunded = BigDecimal.ZERO;
        for (OrderItem item : order.getItems()) {
            System.out.println("Examining itemIndex " + item.getItemIndex());
            System.out.println("Item ID: " + item.getMerchantItemId());

            // Fully refund all the birth stones.
            // I use equalsIgnoreCase because the item ids will most likely return uppercase. Just to be sure, always do
            // string insensitive comparisons on item ids.
            if (item.getMerchantItemId().equalsIgnoreCase("rivoli_14mm_birth")) {
                // Refund reasons may be optional or required and must be on the configured list.
                // See https://secure.ultracart.com/merchant/configuration/refundReasonLoad.do
                // Home -> Configuration -> Order Management -> Refund/Reject Reasons
                item.setRefundReason("DifferentItem");
                item.setQuantityRefunded(item.getQuantity());
                item.setTotalRefunded(item.getTotalCostWithDiscount());

                itemAmountRefunded = itemAmountRefunded.add(item.getTotalCostWithDiscount().getValue());
                System.out.println("birthstones refund amount: " + item.getTotalCostWithDiscount().getValue());
            }

            // Refund two of the opals
            if (item.getMerchantItemId().equalsIgnoreCase("rivoli_14mm_opal")) {
                // Refund reasons may be optional or required and must be on the configured list.
                // See https://secure.ultracart.com/merchant/configuration/refundReasonLoad.do
                // Home -> Configuration -> Order Management -> Refund/Reject Reasons
                item.setRefundReason("CustomerCancel");
                item.setQuantityRefunded(BigDecimal.valueOf(2));

                BigDecimal totalCostOfTwoOpals = item.getUnitCostWithDiscount().getValue().multiply(new BigDecimal(2));
                Currency totalRefunded = new Currency();
                totalRefunded.setValue(totalCostOfTwoOpals);
                totalRefunded.setCurrencyCode("USD");
                item.setTotalRefunded(totalRefunded);

                System.out.println("opals refund amount: " + totalCostOfTwoOpals);
                itemAmountRefunded = itemAmountRefunded.add(totalCostOfTwoOpals);
            }
        }

        BigDecimal taxRate = order.getSummary().getTax().getValue().divide(order.getSummary().getTaxableSubtotal().getValue(), 10, BigDecimal.ROUND_HALF_UP);
        BigDecimal taxAmountRefunded = itemAmountRefunded.multiply(taxRate);
        Currency taxRefunded = new Currency();
        taxRefunded.setValue(taxAmountRefunded);
        taxRefunded.setCurrencyCode("USD");
        order.getSummary().setTaxRefunded(taxRefunded);

        BigDecimal totalRefund = taxAmountRefunded.add(itemAmountRefunded);
        Currency totalRefundCurrency = new Currency();
        totalRefundCurrency.setValue(totalRefund);
        totalRefundCurrency.setCurrencyCode("USD");
        order.getSummary().setTotalRefunded(totalRefundCurrency);

        System.out.println("Item Refund Amount: " + itemAmountRefunded);
        System.out.println("Calculated Tax Rate: " + taxRate);
        System.out.println("Tax Refund Amount: " + taxAmountRefunded);
        System.out.println("Total Refund Amount: " + totalRefund);

        boolean rejectAfterRefund = false;
        boolean skipCustomerNotifications = true;
        boolean autoOrderCancel = false; // if this was an auto order, and they wanted to cancel it, set this flag to true.
        // set manualRefund to true if the actual refund happened outside the system, and you just want a record of it.
        // If UltraCart did not process this refund, manualRefund should be true.
        boolean manualRefund = true; // IMPORTANT: Since my payment method is Purchase Order, I have to specify manual = true Or UltraCart will return a 400 Bad Request.
        boolean reverseAffiliateTransactions = true; // for a full refund, the affiliate should not get credit, or should they?
        boolean issueStoreCredit = false; // if true, the customer would receive store credit instead of a return on their credit card.
        String autoOrderCancelReason = null;

        HashMap<String, Object> refundParams = new HashMap<>();
        refundParams.put("reject_after_refund", rejectAfterRefund);
        refundParams.put("skip_customer_notifications", skipCustomerNotifications);
        refundParams.put("auto_order_cancel", autoOrderCancel);
        refundParams.put("manual_refund", manualRefund);
        refundParams.put("reverse_affiliate_transactions", reverseAffiliateTransactions);
        refundParams.put("issue_store_credit", issueStoreCredit);
        refundParams.put("auto_order_cancel_reason", autoOrderCancelReason);
        refundParams.put("_expand", expansion);

        OrderResponse refundResponse = channelPartnerApi.refundChannelPartnerOrder(orderId, order, rejectAfterRefund, skipCustomerNotifications, autoOrderCancel, manualRefund, reverseAffiliateTransactions, issueStoreCredit, autoOrderCancelReason, expansion);

        Error error = refundResponse.getError();
        Order updatedOrder = refundResponse.getOrder();
        // verify the updated order contains all the desired refunds. verify that refunded total is equal to total.

        // Note: The error 'Request to refund an invalid amount.' means you requested a total refund amount less than or equal to zero.
        System.out.println("Error:");
        System.out.println(error);
        System.out.println("\n\n\n\n\n");
        System.out.println("Order:");
        System.out.println(updatedOrder);
    }
}