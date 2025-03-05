<?php

set_time_limit(600);
ini_set('display_errors', 1);

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


use ultracart\v2\api\ChannelPartnerApi;
use ultracart\v2\models\ChannelPartnerOrder;
use ultracart\v2\models\ChannelPartnerOrderItem;
use ultracart\v2\models\Currency;

require_once '../vendor/autoload.php';
require_once '../constants.php';

echo '<html lang="en"><body><pre>';

$channel_partner_api = ChannelPartnerApi::usingApiKey(Constants::CHANNEL_PARTNER_API_KEY, false, false);
// for a comment on this expansion, see getChannelPartnerOrder sample.
// I don't need billing and shipping address for the refund, but I could need the shipping costs.
// I'm not using coupons or gift_certificates
$expansion = "item,summary,shipping,taxes,payment";

function generateSecureRandomString($length = 10) {
    return bin2hex(random_bytes($length / 2));
}

// --------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------
// Step 1: Create my channel partner order.  To keep this simple, I'm just using a payment method of Purchase Order.
// Note: This is a stripped down importOrder example.  See importChannelPartner sample for detailed fields.

$order = new ChannelPartnerOrder();

$order->setAssociateWithCustomerProfileIfPresent(true);
$order->setAutoApprovePurchaseOrder(true);
$order->setBilltoAddress1("11460 Johns Creek Parkway");
$order->setBilltoAddress2("Suite 101");
$order->setBilltoCity("Duluth");
$order->setBilltoCompany("Widgets Inc");
$order->setBilltoCountryCode("US");
$order->setBilltoDayPhone("6784153823");
$order->setBilltoEveningPhone("6784154019");
$order->setBilltoFirstName("John");
$order->setBilltoLastName("Smith");
$order->setBilltoPostalCode("30097");
$order->setBilltoStateRegion("GA");
$order->setBilltoTitle("Sir");
$order->setCcEmail("orders@widgets.com");
$order->setChannelPartnerOrderId("sdk-" . generateSecureRandomString());
$order->setConsiderRecurring(false);
$order->setPaymentMethod(ChannelPartnerOrder::PAYMENT_METHOD_PURCHASE_ORDER);
$order->setPurchaseOrderNumber(generateSecureRandomString());
$order->setEmail("ceo@widgets.com");
$order->setIpAddress("34.125.95.217");

// -- Items start ---
$item1 = new ChannelPartnerOrderItem();
$item1->setMerchantItemId("rivoli_14mm_ab");
$item1->setQuantity(4);

$item2 = new ChannelPartnerOrderItem();
$item2->setMerchantItemId("rivoli_14mm_birth");
$item2->setQuantity(6);

$item3 = new ChannelPartnerOrderItem();
$item3->setMerchantItemId("rivoli_14mm_colors");
$item3->setQuantity(3);

$item4 = new ChannelPartnerOrderItem();
$item4->setMerchantItemId("rivoli_14mm_mystic");
$item4->setQuantity(2);

$item5 = new ChannelPartnerOrderItem();
$item5->setMerchantItemId("rivoli_14mm_opal");
$item5->setQuantity(4);


$order->setItems([$item1,$item2,$item3,$item4,$item5]);
// -- Items End ---


$order->setLeastCostRoute(true); // Give me the lowest cost shipping
$order->setLeastCostRouteShippingMethods(["FedEx: Ground", "UPS: Ground", "USPS: Retail Ground"]);
$order->setMailingListOptIn(true); // Yes); I confirmed with the customer personally they wish to be on my mailing lists.
$order->setScreenBrandingThemeCode("SF1986"); // Theme codes predated StoreFronts.  Each StoreFront still has a theme code under the hood.  We need that here.  See this screen to find your code: https://secure.ultracart.com/merchant/configuration/customerServiceLoad.do
$order->setShipToResidential(true);
$order->setShiptoAddress1("55 Main Street");
$order->setShiptoAddress2("Suite 202");
$order->setShiptoCity("Duluth");
$order->setShiptoCompany("Widgets Inc");
$order->setShiptoCountryCode("US");
$order->setShiptoDayPhone("6785552323");
$order->setShiptoEveningPhone("7703334444");
$order->setShiptoFirstName("Sally");
$order->setShiptoLastName("McGonkyDee");
$order->setShiptoPostalCode("30097");
$order->setShiptoStateRegion("GA");
$order->setShiptoTitle("Director");
$order->setSkipPaymentProcessing(false);
$order->setSpecialInstructions("Please wrap this in bubble wrap because my FedEx delivery guy is abusive to packages");
$order->setStoreCompleted(false); // this will bypass everything); including shipping.  useful only for importing old orders long completed
$order->setStorefrontHostName('store.mysite.com');
$order->setStoreIfPaymentDeclines(false); // if payment fails); this can send it to Accounts Receivable.  Do not want that.  Fail if payment fails.
$order->setTaxCounty("Gwinnett");
$order->setTaxExempt(false);
$order->setTreatWarningsAsErrors(true);

$api_response = $channel_partner_api->importChannelPartnerOrder($order);
$order_id = $api_response->getOrderId();

echo "Created sample order " . $order_id . "\n";

// --------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------
// Step 2: Refund my channel partner order.
// This order MUST be an order associated with this channel partner, or you will receive a 400 Bad Request.
// I'll need to get the order first, so I'm issuing another get to retrieve the order.
// $order_id = 'DEMO-0009118954';  // <-- I created my order above, so I'll have the order_id from that response
$api_response = $channel_partner_api->getChannelPartnerOrder($order_id, $expansion);

if ($api_response->getError() != null) {
    error_log($api_response->getError()->getDeveloperMessage());
    error_log($api_response->getError()->getUserMessage());
    exit();
}

$order = $api_response->getOrder();

//var_dump($order);
//echo '<br><br>';

// RefundReason may be required, but is optional by default.
// RefundReason may be a set list, or may be freeform.  This is configured on the backend (secure.ultracart.com)
// by Navigating to Home -> Configuration -> Order Management -> Refund/Reject Reasons
// Warning: If this is a 2nd refund after an initial partial refund, be sure you account for the units and amount already refunded.
$order->setRefundReason('CustomerCancel');

$item_amount_refunded = 0;
foreach ($order->getItems() as $item) {
    echo 'Examining itemIndex ' . $item->getItemIndex() . "\n";
    echo 'Item ID: ' . $item->getMerchantItemId() . "\n";

    // Fully refund all the birth stones.
    // I use strcasecmp because the item ids will most likely return uppercase.  Just to be sure, always do
    // string insensitive comparisons on item ids.
    if(strcasecmp($item->getMerchantItemId(),'rivoli_14mm_birth') == 0) {
        // Refund reasons may be optional or required and must be on the configured list.
        // See https://secure.ultracart.com/merchant/configuration/refundReasonLoad.do
        // Home -> Configuration -> Order Management -> Refund/Reject Reasons
        $item->setRefundReason('DifferentItem');
        $item->setQuantityRefunded($item->getQuantity());
        $item->setTotalRefunded($item->getTotalCostWithDiscount());

        $item_amount_refunded += $item->getTotalCostWithDiscount()->getValue();
        echo 'birthstones refund amount: ' . $item->getTotalCostWithDiscount()->getValue() . "\n";
    }

    // Refund two of the opals
    if(strcasecmp($item->getMerchantItemId(),'rivoli_14mm_opal') == 0) {
        // Refund reasons may be optional or required and must be on the configured list.
        // See https://secure.ultracart.com/merchant/configuration/refundReasonLoad.do
        // Home -> Configuration -> Order Management -> Refund/Reject Reasons
        $item->setRefundReason('CustomerCancel');
        $item->setQuantityRefunded(2);

        $total_cost_of_two_opals = $item->getUnitCostWithDiscount()->getValue() * 2;
        $item->setTotalRefunded(new Currency(['value' => $total_cost_of_two_opals, 'currency_code' => 'USD']) );

        echo 'opals refund amount: ' . $total_cost_of_two_opals . "\n";
        $item_amount_refunded += $total_cost_of_two_opals;
    }

}

$tax_rate = $order->getSummary()->getTax()->getValue() / $order->getSummary()->getTaxableSubtotal()->getValue();
$tax_amount_refunded = $item_amount_refunded * $tax_rate;
$taxRefunded = new Currency(['value' => $tax_amount_refunded, 'currency_code' => 'USD']);
$order->getSummary()->setTaxRefunded($taxRefunded);

$total_refund = $tax_amount_refunded + $item_amount_refunded;
$order->getSummary()->setTotalRefunded(new Currency(['value' => $total_refund, 'currency_code' => 'USD']));

echo 'Item Refund Amount: ' . $item_amount_refunded . "\n";
echo 'Calculated Tax Rate:' . $tax_rate . "\n";
echo 'Tax Refund Amount: ' . $tax_amount_refunded . "\n";
echo 'Total Refund Amount: ' . $total_refund . "\n";


$reject_after_refund = false;
$skip_customer_notifications = true;
$auto_order_cancel = false; // if this was an auto order, and they wanted to cancel it, set this flag to true.
// set $manual_refund to true if the actual refund happened outside the system, and you just want a record of it.
// If UltraCart did not process this refund, $manual_refund should be true.
$manual_refund = true; // IMPORTANT: Since my payment method is Purchase Order, I have to specify manual = true Or UltraCart will return a 400 Bad Request.
$reverse_affiliate_transactions = true; // for a full refund, the affiliate should not get credit, or should they?
$issue_store_credit = false;  // if true, the customer would receive store credit instead of a return on their credit card.
$auto_order_cancel_reason = null;

/** @noinspection PhpConditionAlreadyCheckedInspection */
$api_response = $channel_partner_api->refundChannelPartnerOrder($order_id, $order, $reject_after_refund,
    $skip_customer_notifications, $auto_order_cancel, $manual_refund, $reverse_affiliate_transactions,
    $issue_store_credit, $auto_order_cancel_reason, $expansion);

$error = $api_response->getError();
$updated_order = $api_response->getOrder();
// verify the updated order contains all the desired refunds.  verify that refunded total is equal to total.

// Note: The error 'Request to refund an invalid amount.' means you requested a total refund amount less than or equal to zero.
echo 'Error:<br>';
var_dump($error);
echo '<br/><br/><hr/><hr/><br/><br/>Order:<br>';
var_dump($updated_order);
echo '</pre></body></html>';
