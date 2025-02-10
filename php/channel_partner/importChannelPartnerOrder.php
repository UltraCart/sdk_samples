<?php

ini_set('display_errors', 1);

/*
    To run channel partner examples, you will need:
    1) An API Key: https://secure.ultracart.com/merchant/configuration/apiManagementApp.do
    2) That API Key must be assigned to a channel partner: https://secure.ultracart.com/merchant/configuration/customChannelPartnerListLoad.do

    The spreadsheet import docs will serve you well here.  They describe many fields
    https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377246/Channel+Partner+API+-+Spreadsheet+Import

 */


use ultracart\v2\api\ChannelPartnerApi;
use ultracart\v2\models\ChannelPartnerOrder;
use ultracart\v2\models\ChannelPartnerOrderItem;
use ultracart\v2\models\ChannelPartnerOrderItemOption;
use ultracart\v2\models\ChannelPartnerOrderTransaction;
use ultracart\v2\models\ChannelPartnerOrderTransactionDetail;

require_once '../vendor/autoload.php';
require_once '../constants.php';


$channel_partner_api = ChannelPartnerApi::usingApiKey(Constants::CHANNEL_PARTNER_API_KEY);

// NOTICE:
// The real difficulty with using this API is the hosted fields requirement for credit card information.
// You will need to incorporate UltraCart hosted fields in your Customer Service UI and capture credit card
// information through the hosted fields and then provide the tokens here.  You CANNOT provide raw credit
// card information via this interface.
// The two fields in this API are hostedFieldsCardToken and hostedFieldsCvvToken
// Within this sdk_samples github project, review the /hosted_fields/hosted_fields.html file for an example

// There are TWO examples.  The first is an order that still needs the credit card charged.  This example uses
// the hosted fields to collect payment information and pass it to UltraCart for processing.  The second example
// already has payment processed and just passes in the authorization information.

// ---------------------------------------------
// ---------------------------------------------
// Example 1 - Order needs payment processing
// ---------------------------------------------
// ---------------------------------------------

$order = new ChannelPartnerOrder();

// $order->setAdvertisingSource("Friend"); // https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377001/Advertising+Sources
// $order->setAffiliateId(856234); // https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377727/Affiliates
// $order->setAffiliateSubId(1234); // https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1376754/Allowing+Affiliates+to+use+Sub-IDs
// $order->setArbitraryShippingHandlingTotal(9.99);
// $order->setArbitraryTax(2.50);
// $order->setArbitraryTaxRate(7.0);
// $order->setArbitraryTaxableSubtotal(69.99);

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
$order->setChannelPartnerOrderId("widget-1245-abc");
$order->setConsiderRecurring(false);
$order->setCoupons(["10OFF", "BUY1GET1"]);

// $order->setCreditCardAuthorizationAmount( 69.99);
// $order->setCreditCardAuthorizationDts(date('Y-m-d', time()) . "T00:00:00+00:00"); // this will usually not be 'now'.  it will be the actual auth date
// $order->setCreditCardAuthorizationNumber("1234");

$order->setCreditCardExpirationMonth(5);
$order->setCreditCardExpirationYear(2032);
$order->setCreditCardType("VISA"); // see the hosted fields below for the card number and cvv tokens
$order->setCustomField1("Whatever");
$order->setCustomField2("You");
$order->setCustomField3("Want");
$order->setCustomField4("Can");
$order->setCustomField5("Go");
$order->setCustomField6("In");
$order->setCustomField7("CustomFields");
$order->setDeliveryDate(date('Y-m-d', time()) . "T00:00:00+00:00");
$order->setEmail("ceo@widgets.com");
$order->setGift(false);

$order->setGiftEmail("sally@aol.com");
$order->setGiftMessage("Congratulations on your promotion!");

$order->setHostedFieldsCardToken("7C97B0AAA26AB10180B4B29F00380101");
$order->setHostedFieldsCvvToken("C684AB4336787F0180B4B51971380101");

// $order->setInsuranceApplicationId(insuranceApplicationId); // these are used by only a handful of specialized merchants
// $order->setInsuranceClaimId(insuranceClaimId); // these are used by only a handful of specialized merchants

$order->setIpAddress("34.125.95.217");

// -- Items start ---
$item = new ChannelPartnerOrderItem();
// $item->setArbitraryUnitCost(9.99);
// $item->setAutoOrderLastRebillDts(date('Y-m-d', time()) . "T00:00:00+00:00");
// $item->setAutoOrderSchedule("Weekly");

$item->setMerchantItemId("shirt");
$item->setQuantity(1);
$item->setUpsell(false);

$item_option1 = new ChannelPartnerOrderItemOption();
$item_option1->setName("Size");
$item_option1->setValue("Small");

$item_option2 = new ChannelPartnerOrderItemOption();
$item_option2->setName("Color");
$item_option2->setValue("Orange");

$item->setOptions([$item_option1, $item_option2]);

$order->setItems([$item]);
// -- Items End ---


$order->setLeastCostRoute(true); // Give me the lowest cost shipping
$order->setLeastCostRouteShippingMethods(["FedEx: Ground", "UPS: Ground", "USPS: Priority"]);
$order->setMailingListOptIn(true); // Yes); I confirmed with the customer personally they wish to be on my mailing lists.
$order->setNoRealtimePaymentProcessing(false);
$order->setPaymentMethod(ChannelPartnerOrder::PAYMENT_METHOD_CREDIT_CARD);
// $order->setPurchaseOrderNumber("PO-12345");
$order->setRotatingTransactionGatewayCode("MyStripe"); // We wish this to be charged against our Stripe gateway
$order->setScreenBrandingThemeCode("SF1986"); // Theme codes predated StoreFronts.  Each StoreFront still has a theme code under the hood.  We need that here.  See this screen to find your code: https://secure.ultracart.com/merchant/configuration/customerServiceLoad.do
$order->setShipOnDate(date('Y-m-d', time()) . "T00:00:00+00:00");
$order->setShipToResidential(true);
// $order->setShippingMethod("FedEx: Ground"); // We're using LeastCostRoute); so we do not supply this value
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

$orderTransaction = new ChannelPartnerOrderTransaction();
$orderTransaction->setSuccessful(false); // we haven't charged the card yet, so this is false.
$orderTransaction->setDetails([]); // we haven't charged the card yet, so this is empty.
$order->setTransaction($orderTransaction);
$order->setTreatWarningsAsErrors(true);


$api_response = $channel_partner_api->importChannelPartnerOrder($order);


// ---------------------------------------------
// ---------------------------------------------
// Example 2 - Order already processed
// ---------------------------------------------
// ---------------------------------------------

$order = new ChannelPartnerOrder();

// $order->setAdvertisingSource("Friend"); // https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377001/Advertising+Sources
// $order->setAffiliateId(856234); // https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377727/Affiliates
// $order->setAffiliateSubId(1234); // https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1376754/Allowing+Affiliates+to+use+Sub-IDs
// $order->setArbitraryShippingHandlingTotal(9.99);
// $order->setArbitraryTax(2.50);
// $order->setArbitraryTaxRate(7.0);
// $order->setArbitraryTaxableSubtotal(69.99);

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
$order->setChannelPartnerOrderId("widget-1245-abc");
$order->setConsiderRecurring(false);
$order->setCoupons(["10OFF", "BUY1GET1"]);

// $order->setCreditCardAuthorizationAmount( 69.99);
// $order->setCreditCardAuthorizationDts(date('Y-m-d', time()) . "T00:00:00+00:00"); // this will usually not be 'now'.  it will be the actual auth date
// $order->setCreditCardAuthorizationNumber("1234");

$order->setCreditCardExpirationMonth(5);
$order->setCreditCardExpirationYear(2032);
$order->setCreditCardType("VISA"); // see the hosted fields below for the card number and cvv tokens
$order->setCustomField1("Whatever");
$order->setCustomField2("You");
$order->setCustomField3("Want");
$order->setCustomField4("Can");
$order->setCustomField5("Go");
$order->setCustomField6("In");
$order->setCustomField7("CustomFields");
$order->setDeliveryDate(date('Y-m-d', time()) . "T00:00:00+00:00");
$order->setEmail("ceo@widgets.com");
$order->setGift(false);

$order->setGiftEmail("sally@aol.com");
$order->setGiftMessage("Congratulations on your promotion!");

// $order->setInsuranceApplicationId(insuranceApplicationId); // these are used by only a handful of specialized merchants
// $order->setInsuranceClaimId(insuranceClaimId); // these are used by only a handful of specialized merchants

$order->setIpAddress("34.125.95.217");

// -- Items start ---
$item = new ChannelPartnerOrderItem();
// $item->setArbitraryUnitCost(9.99);
// $item->setAutoOrderLastRebillDts(date('Y-m-d', time()) . "T00:00:00+00:00");
// $item->setAutoOrderSchedule("Weekly");

$item->setMerchantItemId("shirt");
$item->setQuantity(1);
$item->setUpsell(false);

$item_option1 = new ChannelPartnerOrderItemOption();
$item_option1->setName("Size");
$item_option1->setValue("Small");

$item_option2 = new ChannelPartnerOrderItemOption();
$item_option2->setName("Color");
$item_option2->setValue("Orange");

$item->setOptions([$item_option1, $item_option2]);

$order->setItems([$item]);
// -- Items End ---


// We don't use least cost routing here.  We've already completed the order and should know what shipping method
// the customer was charged for.  So that is set in the $order->setShippingMethod() function.
// $order->setLeastCostRoute(true); // Give me the lowest cost shipping
// $order->setLeastCostRouteShippingMethods(["FedEx: Ground", "UPS: Ground", "USPS: Priority"]);
$order->setMailingListOptIn(true); // Yes); I confirmed with the customer personally they wish to be on my mailing lists.
$order->setNoRealtimePaymentProcessing(true); // nothing to charge, payment was already collected
$order->setPaymentMethod(ChannelPartnerOrder::PAYMENT_METHOD_CREDIT_CARD);
// $order->setPurchaseOrderNumber("PO-12345");
$order->setRotatingTransactionGatewayCode("MyStripe"); // We wish this to be charged against our Stripe gateway
$order->setScreenBrandingThemeCode("SF1986"); // Theme codes predated StoreFronts.  Each StoreFront still has a theme code under the hood.  We need that here.  See this screen to find your code: https://secure.ultracart.com/merchant/configuration/customerServiceLoad.do
$order->setShipOnDate(date('Y-m-d', time()) . "T00:00:00+00:00");
$order->setShipToResidential(true);
$order->setShippingMethod("FedEx: Ground");
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
$order->setSkipPaymentProcessing(true);  // bypass payment
$order->setSpecialInstructions("Please wrap this in bubble wrap because my FedEx delivery guy is abusive to packages");
$order->setStoreCompleted(true); // this is an old order or an order handled completely outside UltraCart, so do not do anything to it.  Just store it.
$order->setStorefrontHostName('store.mysite.com');
$order->setStoreIfPaymentDeclines(false); // if payment fails); this can send it to Accounts Receivable.  Do not want that.  Fail if payment fails.
$order->setTaxCounty("Gwinnett");
$order->setTaxExempt(false);

$orderTransaction = new ChannelPartnerOrderTransaction();
$orderTransaction->setSuccessful(true); // we haven't charged the card yet, so this is false.

$td1 = new ChannelPartnerOrderTransactionDetail(); // 'td' is short for transaction detail
$td1->setName("AVS Code");
$td1->setValue("X");

$td2 = new ChannelPartnerOrderTransactionDetail(); // 'td' is short for transaction detail
$td2->setName("Authorization Code");
$td2->setValue("123456");

$td3 = new ChannelPartnerOrderTransactionDetail(); // 'td' is short for transaction detail
$td3->setName("CVV Code");
$td3->setValue("M");

$td4 = new ChannelPartnerOrderTransactionDetail(); // 'td' is short for transaction detail
$td4->setName("Response Code");
$td4->setValue("Authorized");

$td5 = new ChannelPartnerOrderTransactionDetail(); // 'td' is short for transaction detail
$td5->setName("Reason Code");
$td5->setValue("1");

$td6 = new ChannelPartnerOrderTransactionDetail(); // 'td' is short for transaction detail
$td6->setName("Response Subcode");
$td6->setValue("1");

$td7 = new ChannelPartnerOrderTransactionDetail(); // 'td' is short for transaction detail
$td7->setName("Transaction ID");
$td7->setValue("1234567890");

$orderTransaction->setDetails([$td1, $td2, $td3, $td4, $td5, $td6, $td7]); //
$order->setTransaction($orderTransaction);
$order->setTreatWarningsAsErrors(true);


$api_response = $channel_partner_api->importChannelPartnerOrder($order);