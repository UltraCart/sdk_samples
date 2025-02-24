package channel_partner;

import com.ultracart.admin.v2.ChannelPartnerApi;
import com.ultracart.admin.v2.models.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;

public class ImportChannelPartnerOrder {
  /*
      To run channel partner examples, you will need:
      1) An API Key: https://secure.ultracart.com/merchant/configuration/apiManagementApp.do
      2) That API Key must be assigned to a channel partner: https://secure.ultracart.com/merchant/configuration/customChannelPartnerListLoad.do

      The spreadsheet import docs will serve you well here.  They describe many fields
      https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377246/Channel+Partner+API+-+Spreadsheet+Import
  */
  public static void execute() {
    System.out.println("--- ImportChannelPartnerOrder ---");

    try {
      // Create channel partner API instance using API key
      ChannelPartnerApi channelPartnerApi = new ChannelPartnerApi(common.Constants.CHANNEL_PARTNER_API_KEY);

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

      ChannelPartnerOrder order = new ChannelPartnerOrder();

      // order.setAdvertisingSource("Friend"); // https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377001/Advertising+Sources
      // order.setAffiliateId(856234); // https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377727/Affiliates
      // order.setAffiliateSubId(1234); // https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1376754/Allowing+Affiliates+to+use+Sub-IDs
      // order.setArbitraryShippingHandlingTotal(new java.math.BigDecimal("9.99"));
      // order.setArbitraryTax(new java.math.BigDecimal("2.50"));
      // order.setArbitraryTaxRate(new java.math.BigDecimal("7.0"));
      // order.setArbitraryTaxableSubtotal(new java.math.BigDecimal("69.99"));

      order.setAssociateWithCustomerProfileIfPresent(true);
      order.setAutoApprovePurchaseOrder(true);
      order.setBilltoAddress1("11460 Johns Creek Parkway");
      order.setBilltoAddress2("Suite 101");
      order.setBilltoCity("Duluth");
      order.setBilltoCompany("Widgets Inc");
      order.setBilltoCountryCode("US");
      order.setBilltoDayPhone("6784153823");
      order.setBilltoEveningPhone("6784154019");
      order.setBilltoFirstName("John");
      order.setBilltoLastName("Smith");
      order.setBilltoPostalCode("30097");
      order.setBilltoStateRegion("GA");
      order.setBilltoTitle("Sir");
      order.setCcEmail("orders@widgets.com");
      order.setChannelPartnerOrderId("widget-1245-abc");
      order.setConsiderRecurring(false);

      ArrayList<String> coupons = new ArrayList<String>();
      coupons.add("10OFF");
      coupons.add("BUY1GET1");
      order.setCoupons(coupons);

      // order.setCreditCardAuthorizationAmount(new java.math.BigDecimal("69.99"));
      // order.setCreditCardAuthorizationDts(Instant.now().toString()); // this will usually not be 'now'. it will be the actual auth date
      // order.setCreditCardAuthorizationNumber("1234");

      order.setCreditCardExpirationMonth(5);
      order.setCreditCardExpirationYear(2032);
      order.setCreditCardType("VISA"); // see the hosted fields below for the card number and cvv tokens
      order.setCustomField1("Whatever");
      order.setCustomField2("You");
      order.setCustomField3("Want");
      order.setCustomField4("Can");
      order.setCustomField5("Go");
      order.setCustomField6("In");
      order.setCustomField7("CustomFields");
      order.setDeliveryDate(Instant.now().toString());
      order.setEmail("ceo@widgets.com");
      order.setGift(false);

      order.setGiftEmail("sally@aol.com");
      order.setGiftMessage("Congratulations on your promotion!");

      order.setHostedFieldsCardToken("7C97B0AAA26AB10180B4B29F00380101");
      order.setHostedFieldsCvvToken("C684AB4336787F0180B4B51971380101");

      // order.setInsuranceApplicationId(insuranceApplicationId); // these are used by only a handful of specialized merchants
      // order.setInsuranceClaimId(insuranceClaimId); // these are used by only a handful of specialized merchants

      order.setIpAddress("34.125.95.217");

      // -- Items start ---
      ChannelPartnerOrderItem item = new ChannelPartnerOrderItem();
      // item.setArbitraryUnitCost(new java.math.BigDecimal("9.99"));
      // item.setAutoOrderLastRebillDts(Instant.now().toString());
      // item.setAutoOrderSchedule("Weekly");

      item.setMerchantItemId("shirt");
      item.setQuantity(BigDecimal.valueOf(1));
      item.setUpsell(false);

      ChannelPartnerOrderItemOption itemOption1 = new ChannelPartnerOrderItemOption();
      itemOption1.setName("Size");
      itemOption1.setValue("Small");

      ChannelPartnerOrderItemOption itemOption2 = new ChannelPartnerOrderItemOption();
      itemOption2.setName("Color");
      itemOption2.setValue("Orange");

      ArrayList<ChannelPartnerOrderItemOption> options = new ArrayList<ChannelPartnerOrderItemOption>();
      options.add(itemOption1);
      options.add(itemOption2);
      item.setOptions(options);

      ArrayList<ChannelPartnerOrderItem> items = new ArrayList<ChannelPartnerOrderItem>();
      items.add(item);
      order.setItems(items);
      // -- Items End ---

      order.setLeastCostRoute(true); // Give me the lowest cost shipping
      ArrayList<String> shippingMethods = new ArrayList<String>();
      shippingMethods.add("FedEx: Ground");
      shippingMethods.add("UPS: Ground");
      shippingMethods.add("USPS: Priority");
      order.setLeastCostRouteShippingMethods(shippingMethods);
      order.setMailingListOptIn(true); // Yes, I confirmed with the customer personally they wish to be on my mailing lists.
      order.setNoRealtimePaymentProcessing(false);
      order.setPaymentMethod(ChannelPartnerOrder.PaymentMethodEnum.CREDIT_CARD);
      // order.setPurchaseOrderNumber("PO-12345");
      order.setRotatingTransactionGatewayCode("MyStripe"); // We wish this to be charged against our Stripe gateway
      order.setScreenBrandingThemeCode("SF1986"); // Theme codes predated StoreFronts. Each StoreFront still has a theme code under the hood. We need that here. See this screen to find your code: https://secure.ultracart.com/merchant/configuration/customerServiceLoad.do
      order.setShipOnDate(Instant.now().toString());
      order.setShipToResidential(true);
      // order.setShippingMethod("FedEx: Ground"); // We're using LeastCostRoute, so we do not supply this value
      order.setShiptoAddress1("55 Main Street");
      order.setShiptoAddress2("Suite 202");
      order.setShiptoCity("Duluth");
      order.setShiptoCompany("Widgets Inc");
      order.setShiptoCountryCode("US");
      order.setShiptoDayPhone("6785552323");
      order.setShiptoEveningPhone("7703334444");
      order.setShiptoFirstName("Sally");
      order.setShiptoLastName("McGonkyDee");
      order.setShiptoPostalCode("30097");
      order.setShiptoStateRegion("GA");
      order.setShiptoTitle("Director");
      order.setSkipPaymentProcessing(false);
      order.setSpecialInstructions("Please wrap this in bubble wrap because my FedEx delivery guy is abusive to packages");
      order.setStoreCompleted(false); // this will bypass everything, including shipping. useful only for importing old orders long completed
      order.setStorefrontHostName("store.mysite.com");
      order.setStoreIfPaymentDeclines(false); // if payment fails, this can send it to Accounts Receivable. Do not want that. Fail if payment fails.
      order.setTaxCounty("Gwinnett");
      order.setTaxExempt(false);

      ChannelPartnerOrderTransaction orderTransaction = new ChannelPartnerOrderTransaction();
      orderTransaction.setSuccessful(false); // we haven't charged the card yet, so this is false.
      orderTransaction.setDetails(new ArrayList<ChannelPartnerOrderTransactionDetail>()); // we haven't charged the card yet, so this is empty.
      order.setTransaction(orderTransaction);
      order.setTreatWarningsAsErrors(true);

      ChannelPartnerImportResponse apiResponse = channelPartnerApi.importChannelPartnerOrder(order);

      // ---------------------------------------------
      // ---------------------------------------------
      // Example 2 - Order already processed
      // ---------------------------------------------
      // ---------------------------------------------

      ChannelPartnerOrder processedOrder = new ChannelPartnerOrder();

      // processedOrder.setAdvertisingSource("Friend"); // https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377001/Advertising+Sources
      // processedOrder.setAffiliateId(856234); // https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377727/Affiliates
      // processedOrder.setAffiliateSubId(1234); // https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1376754/Allowing+Affiliates+to+use+Sub-IDs
      // processedOrder.setArbitraryShippingHandlingTotal(new java.math.BigDecimal("9.99"));
      // processedOrder.setArbitraryTax(new java.math.BigDecimal("2.50"));
      // processedOrder.setArbitraryTaxRate(new java.math.BigDecimal("7.0"));
      // processedOrder.setArbitraryTaxableSubtotal(new java.math.BigDecimal("69.99"));

      processedOrder.setAssociateWithCustomerProfileIfPresent(true);
      processedOrder.setAutoApprovePurchaseOrder(true);
      processedOrder.setBilltoAddress1("11460 Johns Creek Parkway");
      processedOrder.setBilltoAddress2("Suite 101");
      processedOrder.setBilltoCity("Duluth");
      processedOrder.setBilltoCompany("Widgets Inc");
      processedOrder.setBilltoCountryCode("US");
      processedOrder.setBilltoDayPhone("6784153823");
      processedOrder.setBilltoEveningPhone("6784154019");
      processedOrder.setBilltoFirstName("John");
      processedOrder.setBilltoLastName("Smith");
      processedOrder.setBilltoPostalCode("30097");
      processedOrder.setBilltoStateRegion("GA");
      processedOrder.setBilltoTitle("Sir");
      processedOrder.setCcEmail("orders@widgets.com");
      processedOrder.setChannelPartnerOrderId("widget-1245-abc");
      processedOrder.setConsiderRecurring(false);

      ArrayList<String> processedCoupons = new ArrayList<String>();
      processedCoupons.add("10OFF");
      processedCoupons.add("BUY1GET1");
      processedOrder.setCoupons(processedCoupons);

      // processedOrder.setCreditCardAuthorizationAmount(new java.math.BigDecimal("69.99"));
      // processedOrder.setCreditCardAuthorizationDts(Instant.now().toString()); // this will usually not be 'now'. it will be the actual auth date
      // processedOrder.setCreditCardAuthorizationNumber("1234");

      processedOrder.setCreditCardExpirationMonth(5);
      processedOrder.setCreditCardExpirationYear(2032);
      processedOrder.setCreditCardType("VISA"); // see the hosted fields below for the card number and cvv tokens
      processedOrder.setCustomField1("Whatever");
      processedOrder.setCustomField2("You");
      processedOrder.setCustomField3("Want");
      processedOrder.setCustomField4("Can");
      processedOrder.setCustomField5("Go");
      processedOrder.setCustomField6("In");
      processedOrder.setCustomField7("CustomFields");
      processedOrder.setDeliveryDate(Instant.now().toString());
      processedOrder.setEmail("ceo@widgets.com");
      processedOrder.setGift(false);

      processedOrder.setGiftEmail("sally@aol.com");
      processedOrder.setGiftMessage("Congratulations on your promotion!");

      // processedOrder.setInsuranceApplicationId(insuranceApplicationId); // these are used by only a handful of specialized merchants
      // processedOrder.setInsuranceClaimId(insuranceClaimId); // these are used by only a handful of specialized merchants

      processedOrder.setIpAddress("34.125.95.217");

      // -- Items start ---
      ChannelPartnerOrderItem processedItem = new ChannelPartnerOrderItem();
      // processedItem.setArbitraryUnitCost(new java.math.BigDecimal("9.99"));
      // processedItem.setAutoOrderLastRebillDts(Instant.now().toString());
      // processedItem.setAutoOrderSchedule("Weekly");

      processedItem.setMerchantItemId("shirt");
      processedItem.setQuantity(BigDecimal.valueOf(1));
      processedItem.setUpsell(false);

      ChannelPartnerOrderItemOption processedItemOption1 = new ChannelPartnerOrderItemOption();
      processedItemOption1.setName("Size");
      processedItemOption1.setValue("Small");

      ChannelPartnerOrderItemOption processedItemOption2 = new ChannelPartnerOrderItemOption();
      processedItemOption2.setName("Color");
      processedItemOption2.setValue("Orange");

      ArrayList<ChannelPartnerOrderItemOption> processedOptions = new ArrayList<ChannelPartnerOrderItemOption>();
      processedOptions.add(processedItemOption1);
      processedOptions.add(processedItemOption2);
      processedItem.setOptions(processedOptions);

      ArrayList<ChannelPartnerOrderItem> processedItems = new ArrayList<ChannelPartnerOrderItem>();
      processedItems.add(processedItem);
      processedOrder.setItems(processedItems);
      // -- Items End ---

      // We don't use least cost routing here. We've already completed the order and should know what shipping method
      // the customer was charged for. So that is set in the processedOrder.ShippingMethod property.
      // processedOrder.setLeastCostRoute(true); // Give me the lowest cost shipping
      // ArrayList<String> processedShippingMethods = new ArrayList<String>();
      // processedShippingMethods.add("FedEx: Ground");
      // processedShippingMethods.add("UPS: Ground");
      // processedShippingMethods.add("USPS: Priority");
      // processedOrder.setLeastCostRouteShippingMethods(processedShippingMethods);
      processedOrder.setMailingListOptIn(true); // Yes, I confirmed with the customer personally they wish to be on my mailing lists.
      processedOrder.setNoRealtimePaymentProcessing(true); // nothing to charge, payment was already collected
      processedOrder.setPaymentMethod(ChannelPartnerOrder.PaymentMethodEnum.CREDIT_CARD);
      // processedOrder.setPurchaseOrderNumber("PO-12345");
      processedOrder.setRotatingTransactionGatewayCode("MyStripe"); // We wish this to be charged against our Stripe gateway
      processedOrder.setScreenBrandingThemeCode("SF1986"); // Theme codes predated StoreFronts. Each StoreFront still has a theme code under the hood. We need that here. See this screen to find your code: https://secure.ultracart.com/merchant/configuration/customerServiceLoad.do
      processedOrder.setShipOnDate(Instant.now().toString());
      processedOrder.setShipToResidential(true);
      processedOrder.setShippingMethod("FedEx: Ground");
      processedOrder.setShiptoAddress1("55 Main Street");
      processedOrder.setShiptoAddress2("Suite 202");
      processedOrder.setShiptoCity("Duluth");
      processedOrder.setShiptoCompany("Widgets Inc");
      processedOrder.setShiptoCountryCode("US");
      processedOrder.setShiptoDayPhone("6785552323");
      processedOrder.setShiptoEveningPhone("7703334444");
      processedOrder.setShiptoFirstName("Sally");
      processedOrder.setShiptoLastName("McGonkyDee");
      processedOrder.setShiptoPostalCode("30097");
      processedOrder.setShiptoStateRegion("GA");
      processedOrder.setShiptoTitle("Director");
      processedOrder.setSkipPaymentProcessing(true); // bypass payment
      processedOrder.setSpecialInstructions("Please wrap this in bubble wrap because my FedEx delivery guy is abusive to packages");
      processedOrder.setStoreCompleted(true); // this is an old order or an order handled completely outside UltraCart, so do not do anything to it. Just store it.
      processedOrder.setStorefrontHostName("store.mysite.com");
      processedOrder.setStoreIfPaymentDeclines(false); // if payment fails, this can send it to Accounts Receivable. Do not want that. Fail if payment fails.
      processedOrder.setTaxCounty("Gwinnett");
      processedOrder.setTaxExempt(false);

      ChannelPartnerOrderTransaction processedOrderTransaction = new ChannelPartnerOrderTransaction();
      processedOrderTransaction.setSuccessful(true); // transaction was successful

      ArrayList<ChannelPartnerOrderTransactionDetail> details = new ArrayList<ChannelPartnerOrderTransactionDetail>();
      ChannelPartnerOrderTransactionDetail td1 = new ChannelPartnerOrderTransactionDetail(); // 'td' is short for transaction detail
      td1.setName("AVS Code");
      td1.setValue("X");
      details.add(td1);

      ChannelPartnerOrderTransactionDetail td2 = new ChannelPartnerOrderTransactionDetail();
      td2.setName("Authorization Code");
      td2.setValue("123456");
      details.add(td2);

      ChannelPartnerOrderTransactionDetail td3 = new ChannelPartnerOrderTransactionDetail();
      td3.setName("CVV Code");
      td3.setValue("M");
      details.add(td3);

      ChannelPartnerOrderTransactionDetail td4 = new ChannelPartnerOrderTransactionDetail();
      td4.setName("Response Code");
      td4.setValue("Authorized");
      details.add(td4);

      ChannelPartnerOrderTransactionDetail td5 = new ChannelPartnerOrderTransactionDetail();
      td5.setName("Reason Code");
      td5.setValue("1");
      details.add(td5);

      ChannelPartnerOrderTransactionDetail td6 = new ChannelPartnerOrderTransactionDetail();
      td6.setName("Response Subcode");
      td6.setValue("1");
      details.add(td6);

      ChannelPartnerOrderTransactionDetail td7 = new ChannelPartnerOrderTransactionDetail();
      td7.setName("Transaction ID");
      td7.setValue("1234567890");
      details.add(td7);

      processedOrderTransaction.setDetails(details);
      processedOrder.setTransaction(processedOrderTransaction);
      processedOrder.setTreatWarningsAsErrors(true);

      ChannelPartnerImportResponse processedApiResponse = channelPartnerApi.importChannelPartnerOrder(processedOrder);

      System.out.println("Orders imported successfully");
    } catch (Exception ex) {
      System.out.println("Error: " + ex.getMessage());
      ex.printStackTrace();
    }
  }
}