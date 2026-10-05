<?php

ini_set('display_errors', 1);

/*
 * Arbitrary pricing tier on a channel partner order, with verification.
 *
 * This is the ChannelPartnerApi counterpart to ../order/insertOrderArbitraryPricingTier.php.  Both
 * endpoints run through the same import engine, so the behavior is identical.  Use whichever API
 * you are already integrated with.
 *
 * The field:
 *
 *   arbitrary_pricing_tier_names
 *       An array of pricing tier names.  The tiers are applied to the underlying cart before the
 *       items are priced, exactly the way backend order entry assigns them, so ordinary tier
 *       pricing does the work.  No customer profile is involved.
 *
 * Why this exists.  Tier pricing normally reaches an order one of two ways: the shopper logs into a
 * customer profile that belongs to the tier, or a CSR assigns the tier in backend order entry.
 * Neither is available to a server side integration, because the first needs the customer's
 * password and the second needs a human.  This field is the third door.
 *
 * WARNING 1 - arbitrary_unit_cost wins, and it hides that it won.
 *     If a line also supplies arbitrary_unit_cost, that price is used and the tier is ignored for
 *     that line.  No error is raised.  Worse, the line still reports pricing_tier_name, because the
 *     tier really did reach the cart and was then overridden, so the tier name alone is NOT proof
 *     that the tier set the price.  Check the cost.  The two fields are alternatives: let UltraCart
 *     price it, or price it yourself, never both.  If you are converting an existing integration
 *     that already computes line prices, you must remove those prices or this field will silently
 *     appear to do nothing.
 *
 * WARNING 2 - the tier can stick to the customer permanently.
 *     If a customer profile is attached to the order during checkout and the cart arrived without
 *     one, these tiers are granted to that profile and persist for every future order, including
 *     ones the customer places on your storefront.  This happens both when checkout creates a brand
 *     new profile and when it matches an existing profile by email under automatic profile
 *     establishment.  Note that associate_with_customer_profile_if_present, which the other channel
 *     partner samples set to true, makes this materially more likely.  This sample leaves it off.
 *
 * An unknown tier name fails the import outright rather than quietly falling back to base pricing.
 * That is deliberate.  An order that asked to be priced at a tier and silently landed at list price
 * is the kind of error that reaches a customer's invoice unnoticed.
 *
 * To run channel partner examples you need an API key assigned to a channel partner:
 * https://secure.ultracart.com/merchant/configuration/customChannelPartnerListLoad.do
 *
 * See also: ../item/getPricingTiers.php for listing your tiers.
 */

use ultracart\v2\api\ChannelPartnerApi;
use ultracart\v2\api\ItemApi;
use ultracart\v2\api\OrderApi;
use ultracart\v2\models\ChannelPartnerOrder;
use ultracart\v2\models\ChannelPartnerOrderItem;

require_once '../vendor/autoload.php';
require_once '../constants.php';

// Pass all four arguments.  The one argument form defaults verify_ssl to true, which fails against a
// development server whose certificate does not validate.
$channel_partner_api = ChannelPartnerApi::usingApiKey(
    Constants::CHANNEL_PARTNER_API_KEY,
    Constants::MAX_RETRY_SECONDS,
    Constants::VERIFY_SSL,
    Constants::DEBUG
);

$item_api = ItemApi::usingApiKey(
    Constants::API_KEY,
    Constants::MAX_RETRY_SECONDS,
    Constants::VERIFY_SSL,
    Constants::DEBUG
);

// Used only to read the finished order back for verification.
$order_api = OrderApi::usingApiKey(
    Constants::API_KEY,
    Constants::MAX_RETRY_SECONDS,
    Constants::VERIFY_SSL,
    Constants::DEBUG
);


// ---------------------------------------------------------------------------
// The scenario
// ---------------------------------------------------------------------------
// Item TESTPT lists at 10.00 and is configured at 4.95 for the Wholesale tier.
// We order 2 of them and name the tier.  We send no price at all.
//
//   list price            10.00 each
//   Wholesale tier         4.95 each
//   quantity                   2
//                        --------
//   expected subtotal       9.90
//
// If the tier did not apply we would see 20.00 instead, so the assertion at the bottom is
// meaningful rather than decorative.

const TIER_NAME = 'Wholesale';
const ITEM_ID = 'TESTPT';
const LIST_UNIT_COST = 10.00;
const TIER_UNIT_COST = 4.95;
const QUANTITY = 2;

// Unique per run so repeated runs do not collide.  Keep this short: the channel partner order id is
// truncated to 30 characters, and a long prefix will eat the part that makes it unique.
$channel_partner_order_id = 'cptier-' . date('YmdHis');


// ---------------------------------------------------------------------------
// Step 1 - confirm the tier exists
// ---------------------------------------------------------------------------
// The name you send must match one of your configured tiers.  Matching is case insensitive, but the
// name must otherwise be exact.  Listing them first makes this sample self contained and shows you
// where the names come from.

echo "Pricing tiers configured on this account\n";
echo str_repeat('-', 62) . "\n";

try {
    $tiers_response = $item_api->getPricingTiers();
} catch (\ultracart\v2\ApiException $e) {
    echo "Could not list pricing tiers:\n";
    echo $e->getMessage() . "\n";
    echo $e->getResponseBody() . "\n";
    exit(1);
}

$tier_found = false;
foreach ($tiers_response->getPricingTiers() as $tier) {
    $is_target = strcasecmp($tier->getName(), TIER_NAME) === 0;
    $tier_found = $tier_found || $is_target;
    printf(
        "  %-40s %s%s\n",
        $tier->getName(),
        $tier->getDefaultTier() ? '(default) ' : '',
        $is_target ? '<-- using this one' : ''
    );
}
echo "\n";

if (!$tier_found) {
    echo 'Tier "' . TIER_NAME . "\" is not configured on this account.\n";
    echo "Pick one from the list above and update TIER_NAME.\n";
    exit(1);
}


// ---------------------------------------------------------------------------
// Step 2 - build the order
// ---------------------------------------------------------------------------

$order = new ChannelPartnerOrder();

$order->setChannelPartnerOrderId($channel_partner_order_id);

// The field this sample exists to demonstrate.  An array, because a cart can carry several tiers at
// once, the same as backend order entry.  One is the common case.
$order->setArbitraryPricingTierNames([TIER_NAME]);

// Deliberately NOT setting associateWithCustomerProfileIfPresent.  See WARNING 2 above: attaching a
// profile is what makes the tier grant stick to the customer.  Leaving it off keeps this order's
// tier scoped to this order.

// This order is already finished and paid for elsewhere: do not charge and do not fulfill.
$order->setStoreCompleted(true);
$order->setSkipPaymentProcessing(true);
$order->setTreatWarningsAsErrors(true);

// -- Item: no price supplied --
// Deliberately no setArbitraryUnitCost here.  Adding one would override the tier for this line and
// the sample would fail its own assertion, which is exactly the failure mode WARNING 1 describes.
$item = new ChannelPartnerOrderItem();
$item->setMerchantItemId(ITEM_ID);
$item->setQuantity(QUANTITY);

$order->setItems([$item]);

// -- Billing --
$order->setBilltoFirstName('John');
$order->setBilltoLastName('Smith');
$order->setBilltoAddress1('11460 Johns Creek Parkway');
$order->setBilltoCity('Duluth');
$order->setBilltoStateRegion('GA');
$order->setBilltoPostalCode('30097');
$order->setBilltoCountryCode('US');
$order->setBilltoDayPhone('6784153823');
$order->setEmail('ceo@widgets.com');

// -- Shipping --
$order->setShiptoFirstName('John');
$order->setShiptoLastName('Smith');
$order->setShiptoAddress1('11460 Johns Creek Parkway');
$order->setShiptoCity('Duluth');
$order->setShiptoStateRegion('GA');
$order->setShiptoPostalCode('30097');
$order->setShiptoCountryCode('US');
$order->setShiptoDayPhone('6784153823');
$order->setShippingMethod('FedEx: Ground');

// Theme codes predated StoreFronts.  Each StoreFront still has a theme code under the hood, and the
// import needs it to build a cart.  A wrong or missing code fails with "Unable to query cart".  If
// you do not know yours, create a throwaway cart with CheckoutApi::getCart('checkout') and read
// checkout.screen_branding_theme_code off it.
$order->setScreenBrandingThemeCode('DFLT');

// Payment method is required even on a stored-complete import that charges nothing.  Omitting it
// fails the import with "Payment method not specified."
$order->setPaymentMethod(ChannelPartnerOrder::PAYMENT_METHOD_CREDIT_CARD);
$order->setCreditCardType('MasterCard');
$order->setCreditCardExpirationMonth(5);
$order->setCreditCardExpirationYear((int)date('Y') + 2);


// ---------------------------------------------------------------------------
// Step 3 - import
// ---------------------------------------------------------------------------

try {
    $import_response = $channel_partner_api->importChannelPartnerOrder($order);
} catch (\ultracart\v2\ApiException $e) {
    echo "Import threw an exception:\n";
    echo $e->getMessage() . "\n";
    echo $e->getResponseBody() . "\n";
    exit(1);
}

if (!$import_response->getSuccess()) {
    echo "Import failed:\n";
    foreach ((array)$import_response->getImportErrors() as $import_error) {
        echo '  ' . $import_error . "\n";
    }
    // A misspelled tier name surfaces here as "Unknown pricing tier [x] specified."
    exit(1);
}

foreach ((array)$import_response->getImportWarnings() as $import_warning) {
    echo 'Warning: ' . $import_warning . "\n";
}

$order_id = $import_response->getOrderId();
echo "Imported order: $order_id\n\n";


// ---------------------------------------------------------------------------
// Step 4 - query it back and verify
// ---------------------------------------------------------------------------
// arbitrary_pricing_tier_names is write only.  It is honored on import and never echoed back, so we
// assert against the stored RESULT rather than against an echo of our input.

try {
    $get_response = $order_api->getOrder($order_id, 'item,summary');
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
$stored_items = $stored->getItems();

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

echo "Verification\n";
echo str_repeat('-', 62) . "\n";

$all_passed = true;

if (empty($stored_items)) {
    echo "FAIL - the order came back with no items.\n";
    exit(1);
}

$stored_item = $stored_items[0];

// The strongest assertion available.  The order item records WHICH tier priced it, so this proves
// the tier was applied rather than a price coincidentally matching.
$stored_tier_name = $stored_item->getPricingTierName();
$tier_ok = $stored_tier_name !== null && strcasecmp($stored_tier_name, TIER_NAME) === 0;
$all_passed = $all_passed && $tier_ok;
printf("%-44s %10s %6s\n", 'items[0].pricing_tier_name', TIER_NAME, $tier_ok ? 'yes' : 'NO');
if (!$tier_ok) {
    printf("%-44s %10s\n", '  actual was', $stored_tier_name === null ? 'null' : $stored_tier_name);
}

// The unit cost should be the tier price, not the list price.
$stored_cost = currency_value($stored_item->getCost());
$cost_ok = money_matches($stored_cost, TIER_UNIT_COST);
$all_passed = $all_passed && $cost_ok;
printf("%-44s %10s %6s\n", 'items[0].cost (tier price)', number_format(TIER_UNIT_COST, 2), $cost_ok ? 'yes' : 'NO');
if (!$cost_ok) {
    printf("%-44s %10s\n", '  actual was', $stored_cost === null ? 'null' : number_format((float)$stored_cost, 2));
    if (money_matches($stored_cost, LIST_UNIT_COST)) {
        echo "  This is the LIST price, so the tier never reached the cart.  Check that the tier\n";
        echo "  actually has a discount configured for this item.\n";
    } else {
        echo "  This is neither the tier price nor the list price, so something else set it.\n";
        echo "  An arbitrary_unit_cost on the line does exactly this.  See WARNING 1 at the top.\n";
        echo "  Note the tier still shows above, because it did reach the cart and was then\n";
        echo "  overridden for this line.  The tier name alone is not proof of the price.\n";
    }
}

// And the subtotal should reflect it.
$expected_subtotal = TIER_UNIT_COST * QUANTITY;
$stored_subtotal = currency_value($stored->getSummary()->getSubtotal());
$subtotal_ok = money_matches($stored_subtotal, $expected_subtotal);
$all_passed = $all_passed && $subtotal_ok;
printf("%-44s %10s %6s\n", 'summary.subtotal', number_format($expected_subtotal, 2), $subtotal_ok ? 'yes' : 'NO');
if (!$subtotal_ok) {
    printf("%-44s %10s\n", '  actual was', $stored_subtotal === null ? 'null' : number_format((float)$stored_subtotal, 2));
}

echo str_repeat('-', 62) . "\n\n";

echo $all_passed
    ? "PASS - UltraCart priced the line at the " . TIER_NAME . " tier without a customer profile.\n"
    : "FAIL - see the rows marked NO above.\n";

exit($all_passed ? 0 : 1);
