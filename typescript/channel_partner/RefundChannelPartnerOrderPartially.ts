import { channelPartnerApi } from '../api';
import {
    ChannelPartnerApi,
    ChannelPartnerOrder,
    ChannelPartnerOrderItem,
    ChannelPartnerOrderItemOption, ChannelPartnerOrderPaymentMethodEnum,
    ChannelPartnerOrderTransaction,
    ChannelPartnerOrderTransactionDetail, Order
} from 'ultracart_rest_api_v2_typescript';

export class RefundChannelPartnerOrderPartially {
  public static async execute(): Promise<void> {
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

    // for a comment on this expansion, see getChannelPartnerOrder sample.
    // I don't need billing and shipping address for the refund, but I could need the shipping costs.
    // I'm not using coupons or gift_certificates
    const expansion = "item,summary,shipping,taxes,payment";

    // --------------------------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------------------
    // Step 1: Create my channel partner order.  To keep this simple, I'm just using a payment method of Purchase Order.
    // Note: This is a stripped down importOrder example.  See importChannelPartner sample for detailed fields.

    const cpOrder: ChannelPartnerOrder = {
        associate_with_customer_profile_if_present: true,
        auto_approve_purchase_order: true,
        billto_address1: "11460 Johns Creek Parkway",
        billto_address2: "Suite 101",
        billto_city: "Duluth",
        billto_company: "Widgets Inc",
        billto_country_code: "US",
        billto_day_phone: "6784153823",
        billto_evening_phone: "6784154019",
        billto_first_name: "John",
        billto_last_name: "Smith",
        billto_postal_code: "30097",
        billto_state_region: "GA",
        billto_title: "Sir",
        cc_email: "orders@widgets.com",
        channel_partner_order_id: "sdk-" + RefundChannelPartnerOrderPartially.generateSecureRandomString(),
        consider_recurring: false,
        payment_method: ChannelPartnerOrderPaymentMethodEnum.PurchaseOrder,
        purchase_order_number: RefundChannelPartnerOrderPartially.generateSecureRandomString(),
        email: "ceo@widgets.com",
        ip_address: "34.125.95.217",
        items: [{merchant_item_id: "rivoli_14mm_ab", quantity: 4},
            {merchant_item_id: "rivoli_14mm_birth", quantity: 6},
            {merchant_item_id:"rivoli_14mm_colors", quantity: 3},
            {merchant_item_id: "rivoli_14mm_mystic", quantity: 2},
            {merchant_item_id: "rivoli_14mm_opal", quantity: 4}],
        least_cost_route: true, // Give me the lowest cost shipping
        least_cost_route_shipping_methods: ["FedEx: Ground", "UPS: Ground", "USPS: Retail Ground"],
        mailing_list_opt_in: true, // Yes, I confirmed with the customer personally they wish to be on my mailing lists.
        screen_branding_theme_code: "SF1986", // Theme codes predated StoreFronts. Each StoreFront still has a theme code under the hood. We need that here. See this screen to find your code: https://secure.ultracart.com/merchant/configuration/customerServiceLoad.do
        ship_to_residential: true,
        shipto_address1: "55 Main Street",
        shipto_address2: "Suite 202",
        shipto_city: "Duluth",
        shipto_company: "Widgets Inc",
        shipto_country_code: "US",
        shipto_day_phone: "6785552323",
        shipto_evening_phone: "7703334444",
        shipto_first_name: "Sally",
        shipto_last_name: "McGonkyDee",
        shipto_postal_code: "30097",
        shipto_state_region: "GA",
        shipto_title: "Director",
        skip_payment_processing: false,
        special_instructions: "Please wrap this in bubble wrap because my FedEx delivery guy is abusive to packages",
        store_completed: false, // this will bypass everything, including shipping. useful only for importing old orders long completed
        storefront_host_name: "store.mysite.com",
        store_if_payment_declines: false, // if payment fails, this can send it to Accounts Receivable. Do not want that. Fail if payment fails.
        tax_county: "Gwinnett",
        tax_exempt: false,
        treat_warnings_as_errors: true
    };


    const apiResponse = await channelPartnerApi.importChannelPartnerOrder({
        channelPartnerOrder: cpOrder
    });

    const orderIdMaybe = apiResponse.order_id;

    console.log("Created sample order " + orderIdMaybe);

    // --------------------------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------------------
    // Step 2: Refund my channel partner order.
    // This order MUST be an order associated with this channel partner, or you will receive a 400 Bad Request.
    // I'll need to get the order first, so I'm issuing another get to retrieve the order.
    // int orderId = 'DEMO-0009118954'; // <-- I created my order above, so I'll have the orderId from that response

      const orderId = orderIdMaybe as string
    const getResponse = await channelPartnerApi.getChannelPartnerOrder({
      orderId: orderId,
      expand: expansion
    });

    if (getResponse.error != null) {
      console.error(getResponse.error.developer_message);
      console.error(getResponse.error.user_message);
      return;
    }

    const orderMaybe = getResponse.order;
    const order = orderIdMaybe as Order

    // RefundReason may be required, but is optional by default.
    // RefundReason may be a set list, or may be freeform. This is configured on the backend (secure.ultracart.com)
    // by Navigating to Home -> Configuration -> Order Management -> Refund/Reject Reasons
    // Warning: If this is a 2nd refund after an initial partial refund, be sure you account for the units and amount already refunded.
    order.refund_reason = "CustomerCancel";

    let itemAmountRefunded = 0;
    if (order.items) {
      for (const item of order.items) {
        console.log("Examining itemIndex " + item.item_index);
        console.log("Item ID: " + item.merchant_item_id);

        // Fully refund all the birth stones.
        // I use string.Equals because the item ids will most likely return uppercase. Just to be sure, always do
        // string insensitive comparisons on item ids.
        if (item.merchant_item_id?.toLowerCase() === "rivoli_14mm_birth".toLowerCase()) {
          // Refund reasons may be optional or required and must be on the configured list.
          // See https://secure.ultracart.com/merchant/configuration/refundReasonLoad.do
          // Home -> Configuration -> Order Management -> Refund/Reject Reasons
          item.refund_reason = "DifferentItem";
          item.quantity_refunded = item.quantity;
          item.total_refunded = item.total_cost_with_discount;

          itemAmountRefunded += item.total_cost_with_discount?.value || 0;
          console.log("birthstones refund amount: " + item.total_cost_with_discount?.value);
        }

        // Refund two of the opals
        if (item.merchant_item_id?.toLowerCase() === "rivoli_14mm_opal".toLowerCase()) {
          // Refund reasons may be optional or required and must be on the configured list.
          // See https://secure.ultracart.com/merchant/configuration/refundReasonLoad.do
          // Home -> Configuration -> Order Management -> Refund/Reject Reasons
          item.refund_reason = "CustomerCancel";
          item.quantity_refunded = 2;

          const totalCostOfTwoOpals = (item.unit_cost_with_discount?.value || 0) * 2;
          item.total_refunded = {value: totalCostOfTwoOpals, currency_code: "USD"};
          console.log("opals refund amount: " + totalCostOfTwoOpals);
          itemAmountRefunded += totalCostOfTwoOpals;
        }
      }
    }

    if (order.summary) {
      const taxRate = (order.summary.tax?.value || 0) / (order.summary.taxable_subtotal?.value || 1);
      const taxAmountRefunded = itemAmountRefunded * taxRate;
      order.summary.tax_refunded = {value: taxAmountRefunded, currency_code: "USD"};

      const totalRefund = taxAmountRefunded + itemAmountRefunded;
      order.summary.total_refunded = {value: totalRefund, currency_code: "USD"};

      console.log("Item Refund Amount: " + itemAmountRefunded);
      console.log("Calculated Tax Rate: " + taxRate);
      console.log("Tax Refund Amount: " + taxAmountRefunded);
      console.log("Total Refund Amount: " + totalRefund);
    }

    const rejectAfterRefund = false;
    const skipCustomerNotifications = true;
    const autoOrderCancel = false; // if this was an auto order, and they wanted to cancel it, set this flag to true.
    // set manualRefund to true if the actual refund happened outside the system, and you just want a record of it.
    // If UltraCart did not process this refund, manualRefund should be true.
    const manualRefund = true; // IMPORTANT: Since my payment method is Purchase Order, I have to specify manual = true Or UltraCart will return a 400 Bad Request.
    const reverseAffiliateTransactions = true; // for a full refund, the affiliate should not get credit, or should they?
    const issueStoreCredit = false; // if true, the customer would receive store credit instead of a return on their credit card.
    const autoOrderCancelReason = undefined;

    const refundResponse = await channelPartnerApi.refundChannelPartnerOrder({
      orderId: orderId,
      order: order,
      rejectAfterRefund: rejectAfterRefund,
      skipCustomerNotification: skipCustomerNotifications,
      autoOrderCancel: autoOrderCancel,
      manualRefund: manualRefund,
      reverseAffiliateTransactions: reverseAffiliateTransactions,
      issueStoreCredit: issueStoreCredit,
      autoOrderCancelReason: autoOrderCancelReason,
      expand: expansion
    });

    const error = refundResponse.error;
    const updatedOrder = refundResponse.order;
    // verify the updated order contains all the desired refunds. verify that refunded total is equal to total.

    // Note: The error 'Request to refund an invalid amount.' means you requested a total refund amount less than or equal to zero.
    console.log("Error:");
    console.log(error);
    console.log("Order:");
    console.log(updatedOrder);
  }

  private static generateSecureRandomString(length: number = 10): string {
    // Create a random string of specified length
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}