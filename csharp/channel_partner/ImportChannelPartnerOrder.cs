using System;
using System.Collections.Generic;
using System.Reflection;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.channel_partner
{
    public class ImportChannelPartnerOrder
    {
        /*
            To run channel partner examples, you will need:
            1) An API Key: https://secure.ultracart.com/merchant/configuration/apiManagementApp.do
            2) That API Key must be assigned to a channel partner: https://secure.ultracart.com/merchant/configuration/customChannelPartnerListLoad.do

            The spreadsheet import docs will serve you well here.  They describe many fields
            https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377246/Channel+Partner+API+-+Spreadsheet+Import
        */
        public static void Execute()
        {
            Console.WriteLine("--- " + MethodBase.GetCurrentMethod()?.DeclaringType?.Name + " ---");
            var doFirstExample = false;
            try
            {
                // Create channel partner API instance using API key
                ChannelPartnerApi channelPartnerApi = new ChannelPartnerApi(Constants.ChannelPartnerApiKey);
                
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

                if (doFirstExample)
                {

                    // order.AdvertisingSource = "Friend"; // https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377001/Advertising+Sources
                    // order.AffiliateId = 856234; // https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377727/Affiliates
                    // order.AffiliateSubId = 1234; // https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1376754/Allowing+Affiliates+to+use+Sub-IDs
                    // order.ArbitraryShippingHandlingTotal = 9.99;
                    // order.ArbitraryTax = 2.50;
                    // order.ArbitraryTaxRate = 7.0;
                    // order.ArbitraryTaxableSubtotal = 69.99;

                    order.AssociateWithCustomerProfileIfPresent = true;
                    order.AutoApprovePurchaseOrder = true;
                    order.BilltoAddress1 = "11460 Johns Creek Parkway";
                    order.BilltoAddress2 = "Suite 101";
                    order.BilltoCity = "Duluth";
                    order.BilltoCompany = "Widgets Inc";
                    order.BilltoCountryCode = "US";
                    order.BilltoDayPhone = "6784153823";
                    order.BilltoEveningPhone = "6784154019";
                    order.BilltoFirstName = "John";
                    order.BilltoLastName = "Smith";
                    order.BilltoPostalCode = "30097";
                    order.BilltoStateRegion = "GA";
                    order.BilltoTitle = "Sir";
                    order.CcEmail = "orders@widgets.com";
                    order.ChannelPartnerOrderId = "widget-1245-abc";
                    order.ConsiderRecurring = false;
                    order.Coupons = new List<string> { "10OFF", "BUY1GET1" };

                    // order.CreditCardAuthorizationAmount = 69.99;
                    // order.CreditCardAuthorizationDts = DateTime.Now.ToString("yyyy-MM-ddTHH:mm:ssK"); // this will usually not be 'now'. it will be the actual auth date
                    // order.CreditCardAuthorizationNumber = "1234";

                    order.CreditCardExpirationMonth = 5;
                    order.CreditCardExpirationYear = 2032;
                    order.CreditCardType = "VISA"; // see the hosted fields below for the card number and cvv tokens
                    order.CustomField1 = "Whatever";
                    order.CustomField2 = "You";
                    order.CustomField3 = "Want";
                    order.CustomField4 = "Can";
                    order.CustomField5 = "Go";
                    order.CustomField6 = "In";
                    order.CustomField7 = "CustomFields";
                    order.DeliveryDate = DateTime.Now.ToString("yyyy-MM-ddTHH:mm:ssK");
                    order.Email = "ceo@widgets.com";
                    order.Gift = false;

                    order.GiftEmail = "sally@aol.com";
                    order.GiftMessage = "Congratulations on your promotion!";

                    order.HostedFieldsCardToken = "7C97B0AAA26AB10180B4B29F00380101";
                    order.HostedFieldsCvvToken = "C684AB4336787F0180B4B51971380101";

                    // order.InsuranceApplicationId = insuranceApplicationId; // these are used by only a handful of specialized merchants
                    // order.InsuranceClaimId = insuranceClaimId; // these are used by only a handful of specialized merchants

                    order.IpAddress = "34.125.95.217";

                    // -- Items start ---
                    ChannelPartnerOrderItem item = new ChannelPartnerOrderItem();
                    // item.ArbitraryUnitCost = 9.99;
                    // item.AutoOrderLastRebillDts = DateTime.Now.ToString("yyyy-MM-ddTHH:mm:ssK");
                    // item.AutoOrderSchedule = "Weekly";

                    item.MerchantItemId = "shirt";
                    item.Quantity = 1;
                    item.Upsell = false;

                    ChannelPartnerOrderItemOption itemOption1 = new ChannelPartnerOrderItemOption();
                    itemOption1.Name = "Size";
                    itemOption1.Value = "Small";

                    ChannelPartnerOrderItemOption itemOption2 = new ChannelPartnerOrderItemOption();
                    itemOption2.Name = "Color";
                    itemOption2.Value = "Orange";

                    item.Options = new List<ChannelPartnerOrderItemOption> { itemOption1, itemOption2 };

                    order.Items = new List<ChannelPartnerOrderItem> { item };
                    // -- Items End ---


                    order.LeastCostRoute = true; // Give me the lowest cost shipping
                    order.LeastCostRouteShippingMethods = new List<string>
                        { "FedEx: Ground", "UPS: Ground", "USPS: Priority" };
                    order.MailingListOptIn =
                        true; // Yes, I confirmed with the customer personally they wish to be on my mailing lists.
                    order.NoRealtimePaymentProcessing = false;
                    order.PaymentMethod = ChannelPartnerOrder.PaymentMethodEnum.CreditCard;
                    // order.PurchaseOrderNumber = "PO-12345";
                    order.RotatingTransactionGatewayCode =
                        "MyStripe"; // We wish this to be charged against our Stripe gateway
                    order.ScreenBrandingThemeCode =
                        "SF1986"; // Theme codes predated StoreFronts. Each StoreFront still has a theme code under the hood. We need that here. See this screen to find your code: https://secure.ultracart.com/merchant/configuration/customerServiceLoad.do
                    order.ShipOnDate = DateTime.Now.ToString("yyyy-MM-ddTHH:mm:ssK");
                    order.ShipToResidential = true;
                    // order.ShippingMethod = "FedEx: Ground"; // We're using LeastCostRoute, so we do not supply this value
                    order.ShiptoAddress1 = "55 Main Street";
                    order.ShiptoAddress2 = "Suite 202";
                    order.ShiptoCity = "Duluth";
                    order.ShiptoCompany = "Widgets Inc";
                    order.ShiptoCountryCode = "US";
                    order.ShiptoDayPhone = "6785552323";
                    order.ShiptoEveningPhone = "7703334444";
                    order.ShiptoFirstName = "Sally";
                    order.ShiptoLastName = "McGonkyDee";
                    order.ShiptoPostalCode = "30097";
                    order.ShiptoStateRegion = "GA";
                    order.ShiptoTitle = "Director";
                    order.SkipPaymentProcessing = false;
                    order.SpecialInstructions =
                        "Please wrap this in bubble wrap because my FedEx delivery guy is abusive to packages";
                    order.StoreCompleted =
                        false; // this will bypass everything, including shipping. useful only for importing old orders long completed
                    order.StorefrontHostName = "store.mysite.com";
                    order.StoreIfPaymentDeclines =
                        false; // if payment fails, this can send it to Accounts Receivable. Do not want that. Fail if payment fails.
                    order.TaxCounty = "Gwinnett";
                    order.TaxExempt = false;

                    ChannelPartnerOrderTransaction orderTransaction = new ChannelPartnerOrderTransaction();
                    orderTransaction.Successful = false; // we haven't charged the card yet, so this is false.
                    orderTransaction.Details =
                        new List<ChannelPartnerOrderTransactionDetail>(); // we haven't charged the card yet, so this is empty.
                    order.Transaction = orderTransaction;
                    order.TreatWarningsAsErrors = true;

                    var apiResponse = channelPartnerApi.ImportChannelPartnerOrder(order);
                }

                // ---------------------------------------------
                // ---------------------------------------------
                // Example 2 - Order already processed
                // ---------------------------------------------
                // ---------------------------------------------
                
                ChannelPartnerOrder processedOrder = new ChannelPartnerOrder();
                
                // processedOrder.AdvertisingSource = "Friend"; // https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377001/Advertising+Sources
                // processedOrder.AffiliateId = 856234; // https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377727/Affiliates
                // processedOrder.AffiliateSubId = 1234; // https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1376754/Allowing+Affiliates+to+use+Sub-IDs
                // processedOrder.ArbitraryShippingHandlingTotal = 9.99;
                // processedOrder.ArbitraryTax = 2.50;
                // processedOrder.ArbitraryTaxRate = 7.0;
                // processedOrder.ArbitraryTaxableSubtotal = 69.99;
                
                processedOrder.AssociateWithCustomerProfileIfPresent = true;
                processedOrder.AutoApprovePurchaseOrder = true;
                processedOrder.BilltoAddress1 = "11460 Johns Creek Parkway";
                processedOrder.BilltoAddress2 = "Suite 101";
                processedOrder.BilltoCity = "Duluth";
                processedOrder.BilltoCompany = "Widgets Inc";
                processedOrder.BilltoCountryCode = "US";
                processedOrder.BilltoDayPhone = "6784153823";
                processedOrder.BilltoEveningPhone = "6784154019";
                processedOrder.BilltoFirstName = "John";
                processedOrder.BilltoLastName = "Smith";
                processedOrder.BilltoPostalCode = "30097";
                processedOrder.BilltoStateRegion = "GA";
                processedOrder.BilltoTitle = "Sir";
                processedOrder.CcEmail = "orders@widgets.com";
                processedOrder.ChannelPartnerOrderId = "widget-1245-abc";
                processedOrder.ConsiderRecurring = false;
                processedOrder.Coupons = new List<string> { "10OFF", "BUY1GET1" };
                
                // processedOrder.CreditCardAuthorizationAmount = 69.99;
                // processedOrder.CreditCardAuthorizationDts = DateTime.Now.ToString("yyyy-MM-ddTHH:mm:ssK"); // this will usually not be 'now'. it will be the actual auth date
                // processedOrder.CreditCardAuthorizationNumber = "1234";
                
                processedOrder.CreditCardExpirationMonth = 5;
                processedOrder.CreditCardExpirationYear = 2032;
                processedOrder.CreditCardType = "VISA"; // see the hosted fields below for the card number and cvv tokens
                processedOrder.CustomField1 = "Whatever";
                processedOrder.CustomField2 = "You";
                processedOrder.CustomField3 = "Want";
                processedOrder.CustomField4 = "Can";
                processedOrder.CustomField5 = "Go";
                processedOrder.CustomField6 = "In";
                processedOrder.CustomField7 = "CustomFields";
                processedOrder.DeliveryDate = DateTime.Now.ToString("yyyy-MM-ddTHH:mm:ssK");
                processedOrder.Email = "ceo@widgets.com";
                processedOrder.Gift = false;
                
                processedOrder.GiftEmail = "sally@aol.com";
                processedOrder.GiftMessage = "Congratulations on your promotion!";
                
                // processedOrder.InsuranceApplicationId = insuranceApplicationId; // these are used by only a handful of specialized merchants
                // processedOrder.InsuranceClaimId = insuranceClaimId; // these are used by only a handful of specialized merchants
                
                processedOrder.IpAddress = "34.125.95.217";
                
                // -- Items start ---
                ChannelPartnerOrderItem processedItem = new ChannelPartnerOrderItem();
                // processedItem.ArbitraryUnitCost = 9.99;
                // processedItem.AutoOrderLastRebillDts = DateTime.Now.ToString("yyyy-MM-ddTHH:mm:ssK");
                // processedItem.AutoOrderSchedule = "Weekly";
                
                processedItem.MerchantItemId = "shirt";
                processedItem.Quantity = 1;
                processedItem.Upsell = false;
                
                ChannelPartnerOrderItemOption processedItemOption1 = new ChannelPartnerOrderItemOption();
                processedItemOption1.Name = "Size";
                processedItemOption1.Value = "Small";
                
                ChannelPartnerOrderItemOption processedItemOption2 = new ChannelPartnerOrderItemOption();
                processedItemOption2.Name = "Color";
                processedItemOption2.Value = "Orange";
                
                processedItem.Options = new List<ChannelPartnerOrderItemOption> { processedItemOption1, processedItemOption2 };
                
                processedOrder.Items = new List<ChannelPartnerOrderItem> { processedItem };
                // -- Items End ---
                
                // We don't use least cost routing here. We've already completed the order and should know what shipping method
                // the customer was charged for. So that is set in the processedOrder.ShippingMethod property.
                // processedOrder.LeastCostRoute = true; // Give me the lowest cost shipping
                // processedOrder.LeastCostRouteShippingMethods = new List<string> { "FedEx: Ground", "UPS: Ground", "USPS: Priority" };
                processedOrder.MailingListOptIn = true; // Yes, I confirmed with the customer personally they wish to be on my mailing lists.
                processedOrder.NoRealtimePaymentProcessing = true; // nothing to charge, payment was already collected
                processedOrder.PaymentMethod = ChannelPartnerOrder.PaymentMethodEnum.CreditCard;
                // processedOrder.PurchaseOrderNumber = "PO-12345";
                processedOrder.RotatingTransactionGatewayCode = "MyStripe"; // We wish this to be charged against our Stripe gateway
                processedOrder.ScreenBrandingThemeCode = "SF1986"; // Theme codes predated StoreFronts. Each StoreFront still has a theme code under the hood. We need that here. See this screen to find your code: https://secure.ultracart.com/merchant/configuration/customerServiceLoad.do
                processedOrder.ShipOnDate = DateTime.Now.ToString("yyyy-MM-ddTHH:mm:ssK");
                processedOrder.ShipToResidential = true;
                processedOrder.ShippingMethod = "FedEx: Ground";
                processedOrder.ShiptoAddress1 = "55 Main Street";
                processedOrder.ShiptoAddress2 = "Suite 202";
                processedOrder.ShiptoCity = "Duluth";
                processedOrder.ShiptoCompany = "Widgets Inc";
                processedOrder.ShiptoCountryCode = "US";
                processedOrder.ShiptoDayPhone = "6785552323";
                processedOrder.ShiptoEveningPhone = "7703334444";
                processedOrder.ShiptoFirstName = "Sally";
                processedOrder.ShiptoLastName = "McGonkyDee";
                processedOrder.ShiptoPostalCode = "30097";
                processedOrder.ShiptoStateRegion = "GA";
                processedOrder.ShiptoTitle = "Director";
                processedOrder.SkipPaymentProcessing = true; // bypass payment
                processedOrder.SpecialInstructions = "Please wrap this in bubble wrap because my FedEx delivery guy is abusive to packages";
                processedOrder.StoreCompleted = true; // this is an old order or an order handled completely outside UltraCart, so do not do anything to it. Just store it.
                processedOrder.StorefrontHostName = "store.mysite.com";
                processedOrder.StoreIfPaymentDeclines = false; // if payment fails, this can send it to Accounts Receivable. Do not want that. Fail if payment fails.
                processedOrder.TaxCounty = "Gwinnett";
                processedOrder.TaxExempt = false;
                
                ChannelPartnerOrderTransaction processedOrderTransaction = new ChannelPartnerOrderTransaction();
                processedOrderTransaction.Successful = true; // transaction was successful
                
                ChannelPartnerOrderTransactionDetail td1 = new ChannelPartnerOrderTransactionDetail(); // 'td' is short for transaction detail
                td1.Name = "AVS Code";
                td1.Value = "X";
                
                ChannelPartnerOrderTransactionDetail td2 = new ChannelPartnerOrderTransactionDetail();
                td2.Name = "Authorization Code";
                td2.Value = "123456";
                
                ChannelPartnerOrderTransactionDetail td3 = new ChannelPartnerOrderTransactionDetail();
                td3.Name = "CVV Code";
                td3.Value = "M";
                
                ChannelPartnerOrderTransactionDetail td4 = new ChannelPartnerOrderTransactionDetail();
                td4.Name = "Response Code";
                td4.Value = "Authorized";
                
                ChannelPartnerOrderTransactionDetail td5 = new ChannelPartnerOrderTransactionDetail();
                td5.Name = "Reason Code";
                td5.Value = "1";
                
                ChannelPartnerOrderTransactionDetail td6 = new ChannelPartnerOrderTransactionDetail();
                td6.Name = "Response Subcode";
                td6.Value = "1";
                
                ChannelPartnerOrderTransactionDetail td7 = new ChannelPartnerOrderTransactionDetail();
                td7.Name = "Transaction ID";
                td7.Value = "1234567890";
                
                processedOrderTransaction.Details = new List<ChannelPartnerOrderTransactionDetail> { td1, td2, td3, td4, td5, td6, td7 };
                processedOrder.Transaction = processedOrderTransaction;
                processedOrder.TreatWarningsAsErrors = true;
                
                var processedApiResponse = channelPartnerApi.ImportChannelPartnerOrder(processedOrder);
                
                Console.WriteLine("Orders imported successfully");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                Console.WriteLine(ex.StackTrace);
            }
        }
    }
}