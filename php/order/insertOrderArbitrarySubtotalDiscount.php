<?php

ini_set('display_errors', 1);

/*
 * Arbitrary subtotal discount on an imported order, with verification.
 *
 * Use this when you are importing an order that was completed outside UltraCart and it carried an
 * order level discount.  Without these fields your only option is to fold the discount into each
 * line's arbitrary unit cost, which stores a correct total but reports a discount of zero.  That
 * matters if you report on discounts across migrated history.
 *
 * The two fields:
 *
 *   summary.arbitrary_subtotal_discount
 *       Overrides the internally calculated subtotal discount.  Send the GROSS price in each item's
 *       arbitrary unit cost and put the discount here.
 *
 *   summary.arbitrary_taxable_subtotal_discount
 *       Overrides the taxable subtotal discount.  Optional.  If you omit it, the arbitrary subtotal
 *       discount is used for both.  Supply it explicitly when your order mixes taxable and
 *       non-taxable items, because only part of the discount applies to the taxable base.
 *
 * Both are POSITIVE numbers.  They are amounts removed from the order, and they are subtracted
 * internally, so a discount of fifty dollars is 50.00 and never -50.00.  A negative value is
 * rejected.  A value larger than the subtotal is accepted but produces a negative order total, so
 * validate your source data before importing at volume.
 *
 * These fields are write-only.  They are honored on insert and never echoed back.  What you read
 * back is the RESULT, in summary.subtotal_discount and summary.taxable_subtotal_discount, which is
 * exactly what this sample asserts against.
 *
 * A channel partner is required.  Orders inserted this way are channel partner orders, so your API
 * key must be assigned to one:
 * https://secure.ultracart.com/merchant/configuration/customChannelPartnerListLoad.do
 *
 * See also: ../channel_partner/importChannelPartnerOrder.php for the ChannelPartnerApi equivalent,
 * and ../bulk/bulkImportOrders.php if you are importing at volume.
 */

use ultracart\v2\api\OrderApi;
use ultracart\v2\models\Order;
use ultracart\v2\models\OrderChannelPartner;
use ultracart\v2\models\OrderItem;
use ultracart\v2\models\OrderSummary;
use ultracart\v2\models\Currency;

require_once '../vendor/autoload.php';
require_once '../constants.php';

$order_api = OrderApi::usingApiKey(
    Constants::API_KEY,
    Constants::MAX_RETRY_SECONDS,
    Constants::VERIFY_SSL,
    Constants::DEBUG
);


// ---------------------------------------------------------------------------
// The scenario
// ---------------------------------------------------------------------------
// One line, quantity 2, gross price 100.00 each, so a gross subtotal of 200.00.
// The customer received 50.00 off the order.  Shipping was 9.99 and tax was 10.50.
//
//   gross subtotal      200.00
//   subtotal discount   -50.00
//   shipping              9.99
//   tax                  10.50
//                      -------
//   order total         170.49
//
// Note what we are NOT doing: we are not dividing 150.00 by 2 to get a net unit cost of 75.00.
// That is the old workaround.  It stores the right total but loses the discount, and it breaks
// outright when the division is not clean (150.00 / 7 does not divide into whole cents).  Carrying
// the discount at the order level keeps the unit cost a clean catalog price.

const GROSS_UNIT_COST = 100.00;
const QUANTITY = 2;
const SUBTOTAL_DISCOUNT = 50.00;
const SHIPPING = 9.99;
const TAX = 10.50;

// Unique per run so repeated runs do not collide.  Keep this short: the channel partner order id is
// truncated to 30 characters, and a long prefix will eat the part that makes it unique.
$channel_partner_order_id = 'arbdisc-' . date('YmdHis');


// ---------------------------------------------------------------------------
// Build the order
// ---------------------------------------------------------------------------

$order = new Order();

// Channel partner block. store_completed tells UltraCart this order is already finished: do not
// charge anything and do not send it to fulfillment.
$channel_partner = new OrderChannelPartner();
// Required on insert.  Find yours at Home -> Configuration -> Channel Partners -> Custom.
$channel_partner->setChannelPartnerCode('SDK');
$channel_partner->setChannelPartnerOrderId($channel_partner_order_id);
$channel_partner->setStoreCompleted(true);
$channel_partner->setSkipPaymentProcessing(true);
$channel_partner->setNoRealtimePaymentProcessing(true);

// The item below is auto orderable.  Without this, a stored-complete import is rejected outright,
// because enrolling a historical order in a live subscription is almost never what you want.  For a
// large migration, tick "Skip Auto Order Setup" on the channel partner instead, so no single
// malformed record can re-enable enrollment.
$channel_partner->setSkipAutoOrderSetup(true);

$order->setChannelPartner($channel_partner);

// -- Item: GROSS unit cost, not net of discount --
$item = new OrderItem();
// Any simple catalog item works.  Avoid items with required options unless you also supply them.
$item->setMerchantItemId('AMPI125');
$item->setQuantity(QUANTITY);

$arbitrary_unit_cost = new Currency();
$arbitrary_unit_cost->setValue(GROSS_UNIT_COST);
$item->setArbitraryUnitCost($arbitrary_unit_cost);

$order->setItems([$item]);

// -- Summary: shipping, and the new discount fields --
$summary = new OrderSummary();

$arbitrary_shipping = new Currency();
$arbitrary_shipping->setValue(SHIPPING);
$summary->setArbitraryShippingHandlingTotal($arbitrary_shipping);

// The new field.  A Currency object, matching arbitrary_shipping_handling_total and
// arbitrary_unit_cost.  Note this differs from the taxes.arbitrary_* fields, which are bare
// decimals; that inconsistency is historical.
$arbitrary_subtotal_discount = new Currency();
$arbitrary_subtotal_discount->setValue(SUBTOTAL_DISCOUNT);
$summary->setArbitrarySubtotalDiscount($arbitrary_subtotal_discount);

// Everything in this order is taxable, so the taxable discount equals the subtotal discount.  We
// set it explicitly to show the field; omitting it would produce the same result here.
$arbitrary_taxable_subtotal_discount = new Currency();
$arbitrary_taxable_subtotal_discount->setValue(SUBTOTAL_DISCOUNT);
$summary->setArbitraryTaxableSubtotalDiscount($arbitrary_taxable_subtotal_discount);

$order->setSummary($summary);

// -- Taxes --
// Send arbitrary_tax WITHOUT arbitrary_tax_rate.  An arbitrary tax with no rate locks the order's
// taxes and skips the tax provider entirely.  Sending both leaves the lock off and makes a live
// call to your tax provider whose result is then discarded, which is pure waste at volume.
$taxes = new \ultracart\v2\models\OrderTaxes();
$taxes->setArbitraryTax(TAX);
$order->setTaxes($taxes);

// -- Minimal billing and shipping --
$billing = new \ultracart\v2\models\OrderBilling();
$billing->setFirstName('John');
$billing->setLastName('Smith');
$billing->setAddress1('11460 Johns Creek Parkway');
$billing->setCity('Duluth');
$billing->setStateRegion('GA');
$billing->setPostalCode('30097');
$billing->setCountryCode('US');
$billing->setDayPhone('6784153823');
$billing->setEmail('ceo@widgets.com');
$order->setBilling($billing);

$shipping = new \ultracart\v2\models\OrderShipping();
$shipping->setFirstName('John');
$shipping->setLastName('Smith');
$shipping->setAddress1('11460 Johns Creek Parkway');
$shipping->setCity('Duluth');
$shipping->setStateRegion('GA');
$shipping->setPostalCode('30097');
$shipping->setCountryCode('US');
$shipping->setDayPhone('6784153823');
$shipping->setShippingMethod('FedEx: Ground');
$order->setShipping($shipping);

// -- Checkout --
// The theme code identifies which StoreFront the order belongs to.  Without it the import cannot
// build a cart and fails with "Unable to query cart".
$checkout = new \ultracart\v2\models\OrderCheckout();
$checkout->setScreenBrandingThemeCode('SF1986');
$order->setCheckout($checkout);

// -- Payment --
// The order was already paid for outside UltraCart, so nothing is charged here.  The channel partner
// flags above (skip_payment_processing, no_realtime_payment_processing) are what suppress processing.
$payment = new \ultracart\v2\models\OrderPayment();
$payment->setPaymentMethod(\ultracart\v2\models\OrderPayment::PAYMENT_METHOD_CREDIT_CARD);
$order->setPayment($payment);


// ---------------------------------------------------------------------------
// Insert
// ---------------------------------------------------------------------------

$expansion = 'item,summary,taxes,channel_partner';

try {
    $insert_response = $order_api->insertOrder($order, $expansion);
} catch (\ultracart\v2\ApiException $e) {
    echo "Insert threw an exception:\n";
    echo $e->getMessage() . "\n";
    echo $e->getResponseBody() . "\n";
    exit(1);
}

if ($insert_response->getError() != null) {
    echo "Insert failed:\n";
    echo '  ' . $insert_response->getError()->getDeveloperMessage() . "\n";
    echo '  ' . $insert_response->getError()->getUserMessage() . "\n";
    exit(1);
}

$inserted = $insert_response->getOrder();
$order_id = $inserted->getOrderId();
echo "Inserted order: $order_id\n\n";


// ---------------------------------------------------------------------------
// Query it back and verify
// ---------------------------------------------------------------------------
// This is the point of the sample.  The arbitrary_* fields are write-only, so we assert against the
// stored result rather than against an echo of our input.

try {
    $get_response = $order_api->getOrder($order_id, $expansion);
} catch (\ultracart\v2\ApiException $e) {
    echo "Query threw an exception:\n";
    echo $e->getMessage() . "\n";
    exit(1);
}

if ($get_response->getError() != null) {
    echo "Query failed:\n";
    echo '  ' . $get_response->getError()->getDeveloperMessage() . "\n";
    exit(1);
}

$stored = $get_response->getOrder();
$stored_summary = $stored->getSummary();

/**
 * Money comes back as Currency objects.  Pull the raw value, tolerating nulls.
 */
function currency_value($currency)
{
    return $currency === null ? null : $currency->getValue();
}

/**
 * Compare to the cent.  Never compare money with ==.
 */
function money_matches($actual, $expected): bool
{
    if ($actual === null) {
        return false;
    }
    return bccomp(number_format((float)$actual, 2, '.', ''), number_format((float)$expected, 2, '.', ''), 2) === 0;
}

$expected_gross_subtotal = GROSS_UNIT_COST * QUANTITY;              // 200.00
$expected_total = $expected_gross_subtotal - SUBTOTAL_DISCOUNT + SHIPPING + TAX;  // 170.49

$checks = [
    [
        'label' => 'summary.subtotal (gross, before discount)',
        'actual' => currency_value($stored_summary->getSubtotal()),
        'expected' => $expected_gross_subtotal,
    ],
    [
        'label' => 'summary.subtotal_discount',
        'actual' => currency_value($stored_summary->getSubtotalDiscount()),
        'expected' => SUBTOTAL_DISCOUNT,
    ],
    [
        'label' => 'summary.taxable_subtotal_discount',
        'actual' => currency_value($stored_summary->getTaxableSubtotalDiscount()),
        'expected' => SUBTOTAL_DISCOUNT,
    ],
    [
        'label' => 'summary.shipping_handling_total',
        'actual' => currency_value($stored_summary->getShippingHandlingTotal()),
        'expected' => SHIPPING,
    ],
    [
        'label' => 'summary.tax',
        'actual' => currency_value($stored_summary->getTax()),
        'expected' => TAX,
    ],
    [
        'label' => 'summary.total',
        'actual' => currency_value($stored_summary->getTotal()),
        'expected' => $expected_total,
    ],
];

echo "Verification\n";
echo str_repeat('-', 62) . "\n";
printf("%-44s %10s %6s\n", 'FIELD', 'EXPECTED', 'OK');

$all_passed = true;
foreach ($checks as $check) {
    $passed = money_matches($check['actual'], $check['expected']);
    $all_passed = $all_passed && $passed;
    printf(
        "%-44s %10s %6s\n",
        $check['label'],
        number_format($check['expected'], 2),
        $passed ? 'yes' : 'NO'
    );
    if (!$passed) {
        printf("%-44s %10s\n", '  actual was', $check['actual'] === null ? 'null' : number_format((float)$check['actual'], 2));
    }
}

echo str_repeat('-', 62) . "\n";

// The line should still carry the GROSS cost.  If this comes back as 75.00 then the discount was
// folded into the line somewhere, which is the behavior these fields exist to avoid.
$stored_items = $stored->getItems();
if (!empty($stored_items)) {
    $stored_cost = currency_value($stored_items[0]->getCost());
    $cost_ok = money_matches($stored_cost, GROSS_UNIT_COST);
    $all_passed = $all_passed && $cost_ok;
    printf(
        "%-44s %10s %6s\n",
        'items[0].cost (stays gross)',
        number_format(GROSS_UNIT_COST, 2),
        $cost_ok ? 'yes' : 'NO'
    );
    if (!$cost_ok) {
        printf("%-44s %10s\n", '  actual was', $stored_cost === null ? 'null' : number_format((float)$stored_cost, 2));
    }
}

echo "\n";
echo $all_passed
    ? "PASS - the discount was stored as its own figure and the line kept its gross price.\n"
    : "FAIL - see the rows marked NO above.\n";

exit($all_passed ? 0 : 1);
