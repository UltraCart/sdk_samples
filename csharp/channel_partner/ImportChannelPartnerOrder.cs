using System;
using System.Collections.Generic;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.channel_partner
{
    // ReSharper disable once ClassNeverInstantiated.Global
    public class ImportChannelPartnerOrder
    {
        // uncomment to run.  C# projects can only have one main.
        // To run channel partner examples, you will need:
        // 1) An API Key: https://secure.ultracart.com/merchant/configuration/apiManagementApp.do
        // 2) That API Key must be assigned to a channel partner: https://secure.ultracart.com/merchant/configuration/customChannelPartnerListLoad.do
        // public static void Main()
        // {
        //     // var result = ImportChannelPartnerOrderThatStillNeedsPaymentCall();
        //     var result = ImportChannelPartnerOrderAlreadyShippedCall();
        //     if (result.Success == true)
        //     {
        //         Console.Out.WriteLine("Order was successfully imported.");
        //         Console.Out.WriteLine("Order ID: " + result.OrderId);
        //     }
        //     else
        //     {
        //         Console.Out.WriteLine("Import Errors:");
        //         foreach (var importError in result.ImportErrors)
        //         {
        //             Console.Out.WriteLine(importError);
        //         }
        //         Console.Out.WriteLine("Import Warnings:");
        //         foreach (var importWarning in result.ImportWarnings)
        //         {
        //             Console.Out.WriteLine(importWarning);
        //         }
        //         
        //     }
        //     // Utility.DumpObject(result, "Import Order Result");
        // }

        // ReSharper disable once MemberCanBePrivate.Global
        // This method constructs an order from a call center that has taken payment information but still needs
        // the credit card charged.  The next method below this one constructs an order that is completely finished
        // both with payment and shipping.  
        public static ChannelPartnerImportResponse ImportChannelPartnerOrderThatStillNeedsPaymentCall()
        {
            var api = new ChannelPartnerApi(Constants.API_KEY);
            
            // The spreadsheet import docs will serve you well here.
            // https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377246/Channel+Partner+API+-+Spreadsheet+Import

            // NOTICE:
            // The real difficulty with using this API is the hosted fields requirement for credit card information.
            // You will need to incorporate UltraCart hosted fields in your Customer Service UI and capture credit card
            // information through the hosted fields and then provide the tokens here.  You CANNOT provide raw credit
            // card information via this interface.
            // The two fields in this API are HostedFieldsCardToken and HostedFieldsCvvToken
            // Within this sdk_samples project, review the /hosted_fields/hosted_fields.html file for an example

            ChannelPartnerOrder order = new ChannelPartnerOrder()
            {
                // AdvertisingSource = "Friend", // https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377001/Advertising+Sources
                // AffiliateId = 856234, // https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377727/Affiliates
                // AffiliateSubId = 1234, // https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1376754/Allowing+Affiliates+to+use+Sub-IDs
                // ArbitraryShippingHandlingTotal = 9.99m,
                // ArbitraryTax = 2.50m,
                // ArbitraryTaxRate = 7.0m,
                // ArbitraryTaxableSubtotal = 69.99m,
                AssociateWithCustomerProfileIfPresent = true,
                AutoApprovePurchaseOrder = true,
                BilltoAddress1 = "11460 Johns Creek Parkway",
                BilltoAddress2 = "Suite 101",
                BilltoCity = "Duluth",
                BilltoCompany = "Widgets Inc",
                BilltoCountryCode = "US",
                BilltoDayPhone = "6784153823",
                BilltoEveningPhone = "6784154019",
                BilltoFirstName = "John",
                BilltoLastName = "Smith",
                BilltoPostalCode = "30097",
                BilltoStateRegion = "GA",
                BilltoTitle = "Sir",
                CcEmail = "orders@widgets.com",
                ChannelPartnerOrderId = "widget-1245-abc",
                ConsiderRecurring = false,
                Coupons = new List<string>() { "10OFF", "BUY1GET1" },
                // CreditCardAuthorizationAmount = 69.99m,
                // CreditCardAuthorizationDts =
                //    DateTime.Now.ToString("s", System.Globalization.CultureInfo.InvariantCulture),
                // CreditCardAuthorizationNumber = "1234",
                CreditCardExpirationMonth = 5,
                CreditCardExpirationYear = 2032,
                CreditCardType = "VISA", // see the hosted fields below for the card number and cvv tokens
                CustomField1 = "Whatever",
                CustomField2 = "You",
                CustomField3 = "Want",
                CustomField4 = "Can",
                CustomField5 = "Go",
                CustomField6 = "In",
                CustomField7 = "CustomFields",
                DeliveryDate =
                    DateTime.Now.AddDays(14).ToString("s", System.Globalization.CultureInfo.InvariantCulture),
                Email = "ceo@widgets.com",
                Gift = false,
                // GiftEmail = "sally@aol.com",
                // GiftMessage = "Congratulations on your promotion!",
                HostedFieldsCardToken = "7C97B0AAA26AB10180B4B29F00380101",
                HostedFieldsCvvToken = "C684AB4336787F0180B4B51971380101",
                // InsuranceApplicationId = insuranceApplicationId,
                // InsuranceClaimId = insuranceClaimId,
                IpAddress = "34.125.95.217",
                Items = new List<ChannelPartnerOrderItem>()
                {
                    new ChannelPartnerOrderItem()
                    {
                        // ArbitraryUnitCost = 9.99m,
                        // AutoOrderLastRebillDts = DateTime.Now.AddDays(-30).ToString("s", System.Globalization.CultureInfo.InvariantCulture),
                        // AutoOrderSchedule = "Weekly",
                        MerchantItemId = "shirt",
                        Options = new List<ChannelPartnerOrderItemOption>()
                        {
                            new ChannelPartnerOrderItemOption()
                            {
                                Name = "Size",
                                Value = "Small"
                            },
                            new ChannelPartnerOrderItemOption()
                            {
                                Name = "Color",
                                Value = "Orange"
                            }
                        },
                        Quantity = 1,
                        Upsell = false,
                    }
                },
                LeastCostRoute = true, // Give me the lowest cost shipping
                LeastCostRouteShippingMethods = new List<string>()
                {
                    "FedEx: Ground",
                    "UPS: Ground",
                    "USPS: Priority"
                },
                MailingListOptIn =
                    true, // Yes, I confirmed with the customer personally they wish to be on my mailing lists.
                NoRealtimePaymentProcessing = false,
                PaymentMethod = ChannelPartnerOrder.PaymentMethodEnum.CreditCard,
                // PurchaseOrderNumber = "PO-12345",
                RotatingTransactionGatewayCode = "MyStripe", // We wish this to be charged against our Stripe gateway
                ScreenBrandingThemeCode =
                    "SF1986", // Theme codes predated StoreFronts.  Each StoreFront still has a theme code under the hood.  We need that here.  See this screen to find your code: https://secure.ultracart.com/merchant/configuration/customerServiceLoad.do
                ShipOnDate = DateTime.Now.AddDays(7).ToString("s", System.Globalization.CultureInfo.InvariantCulture),
                ShipToResidential = true,
                // ShippingMethod = "FedEx: Ground", // We're using LeastCostRoute, so we do not supply this value
                ShiptoAddress1 = "55 Main Street",
                ShiptoAddress2 = "Suite 202",
                ShiptoCity = "Duluth",
                ShiptoCompany = "Widgets Inc",
                ShiptoCountryCode = "US",
                ShiptoDayPhone = "6785552323",
                ShiptoEveningPhone = "7703334444",
                ShiptoFirstName = "Sally",
                ShiptoLastName = "McGonkyDee",
                ShiptoPostalCode = "30097",
                ShiptoStateRegion = "GA",
                ShiptoTitle = "Director",
                SkipPaymentProcessing = false,
                SpecialInstructions =
                    "Please wrap this in bubble wrap because my FedEx delivery guy is abusive to packages",
                StoreCompleted =
                    false, // this will bypass everything, including shipping.  useful only for importing old orders long completed
                StoreIfPaymentDeclines =
                    false, // if payment fails, this can send it to Accounts Receivable.  Do not want that.  Fail if payment fails.
                TaxCounty = "Gwinnett",
                TaxExempt = false,
                Transaction =
                    new ChannelPartnerOrderTransaction() // we haven't charged the card yet, so this is false and empty.
                    {
                        Successful = false,
                        Details = new List<ChannelPartnerOrderTransactionDetail>()
                        {
                        }
                    },
                TreatWarningsAsErrors = true,
            };
            
            var response = api.ImportChannelPartnerOrder(order);
            return response;
        }
        
        
        // For a legacy order, the important field is 'StoreCompleted'.  If true, the order is simply archived without
        // collecting payment or routing to shipping.
        public static ChannelPartnerImportResponse ImportChannelPartnerOrderAlreadyShippedCall()
        {
            var api = new ChannelPartnerApi(Constants.API_KEY);
            
            // The spreadsheet import docs will serve you well here.
            // https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377246/Channel+Partner+API+-+Spreadsheet+Import
            
            ChannelPartnerOrder order = new ChannelPartnerOrder()
            {
                // AdvertisingSource = "Friend", // https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377001/Advertising+Sources
                // AffiliateId = 856234, // https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377727/Affiliates
                // AffiliateSubId = 1234, // https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1376754/Allowing+Affiliates+to+use+Sub-IDs
                // ArbitraryShippingHandlingTotal = 9.99m,
                // ArbitraryTax = 2.50m,
                // ArbitraryTaxRate = 7.0m,
                // ArbitraryTaxableSubtotal = 69.99m,
                AssociateWithCustomerProfileIfPresent = true,
                AutoApprovePurchaseOrder = true,
                BilltoAddress1 = "11460 Johns Creek Parkway",
                BilltoAddress2 = "Suite 101",
                BilltoCity = "Duluth",
                BilltoCompany = "Widgets Inc",
                BilltoCountryCode = "US",
                BilltoDayPhone = "6784153823",
                BilltoEveningPhone = "6784154019",
                BilltoFirstName = "John",
                BilltoLastName = "Smith",
                BilltoPostalCode = "30097",
                BilltoStateRegion = "GA",
                BilltoTitle = "Sir",
                CcEmail = "orders@widgets.com",
                ChannelPartnerOrderId = "widget-1245-abc",
                ConsiderRecurring = false,
                Coupons = new List<string>() { "10OFF" },
                CreditCardAuthorizationAmount = 69.99m,
                CreditCardAuthorizationDts =
                    DateTime.Now.ToString("s", System.Globalization.CultureInfo.InvariantCulture),
                CreditCardAuthorizationNumber = "1234",
                CreditCardExpirationMonth = 5,
                CreditCardExpirationYear = 2032,
                CreditCardType = "VISA",
                CustomField1 = "Whatever",
                CustomField2 = "You",
                CustomField3 = "Want",
                CustomField4 = "Can",
                CustomField5 = "Go",
                CustomField6 = "In",
                CustomField7 = "CustomFields",
                DeliveryDate =
                    DateTime.Now.AddDays(14).ToString("s", System.Globalization.CultureInfo.InvariantCulture),
                Email = "ceo@widgets.com",
                Gift = false,
                // GiftEmail = "sally@aol.com",
                // GiftMessage = "Congratulations on your promotion!",
                // HostedFieldsCardToken = "7C97B0AAA26AB10180B4B29F00380101",
                // HostedFieldsCvvToken = "C684AB4336787F0180B4B51971380101",
                // InsuranceApplicationId = insuranceApplicationId,
                // InsuranceClaimId = insuranceClaimId,
                IpAddress = "34.125.95.217",
                Items = new List<ChannelPartnerOrderItem>()
                {
                    new ChannelPartnerOrderItem()
                    {
                        // ArbitraryUnitCost = 9.99m,
                        // AutoOrderLastRebillDts = DateTime.Now.AddDays(-30).ToString("s", System.Globalization.CultureInfo.InvariantCulture),
                        // AutoOrderSchedule = "Weekly",
                        MerchantItemId = "shirt",
                        Options = new List<ChannelPartnerOrderItemOption>()
                        {
                            new ChannelPartnerOrderItemOption()
                            {
                                Name = "Size",
                                Value = "Small"
                            },
                            new ChannelPartnerOrderItemOption()
                            {
                                Name = "Color",
                                Value = "Orange"
                            }
                        },
                        Quantity = 1,
                        Upsell = false,
                    }
                },
                // LeastCostRoute = true, // Give me the lowest cost shipping
                // LeastCostRouteShippingMethods = new List<string>()
                // {
                //    "FedEx: Ground",
                //    "UPS: Ground",
                //    "USPS: Priority"
                //},
                MailingListOptIn = true, 
                NoRealtimePaymentProcessing = true, // nothing to charge, payment was already collected
                PaymentMethod = ChannelPartnerOrder.PaymentMethodEnum.CreditCard,
                // PurchaseOrderNumber = "PO-12345",
                RotatingTransactionGatewayCode = "MyStripe", // We wish this to be charged against our Stripe gateway
                ScreenBrandingThemeCode =
                    "SF1986", // Theme codes predated StoreFronts.  Each StoreFront still has a theme code under the hood.  We need that here.  See this screen to find your code: https://secure.ultracart.com/merchant/configuration/customerServiceLoad.do
                ShipOnDate = DateTime.Now.AddDays(7).ToString("s", System.Globalization.CultureInfo.InvariantCulture),
                ShipToResidential = true,
                ShippingMethod = "FedEx: Ground",
                ShiptoAddress1 = "55 Main Street",
                ShiptoAddress2 = "Suite 202",
                ShiptoCity = "Duluth",
                ShiptoCompany = "Widgets Inc",
                ShiptoCountryCode = "US",
                ShiptoDayPhone = "6785552323",
                ShiptoEveningPhone = "7703334444",
                ShiptoFirstName = "Sally",
                ShiptoLastName = "McGonkyDee",
                ShiptoPostalCode = "30097",
                ShiptoStateRegion = "GA",
                ShiptoTitle = "Director",
                SkipPaymentProcessing = true, // bypass payment
                SpecialInstructions =
                    "Please wrap this in bubble wrap because my FedEx delivery guy is abusive to packages",
                StoreCompleted =  true, // this is a legacy order, so do not do anything to it.  Just store it.
                // StoreIfPaymentDeclines = false, // not needed because no payment is being collected.
                TaxCounty = "Gwinnett",
                TaxExempt = false,
                // We do list our transaction data here, whatever name/value information our gateway returned
                Transaction =
                    new ChannelPartnerOrderTransaction() // we haven't charged the card yet, so this is false and empty.
                    {
                        Successful = true,
                        Details = new List<ChannelPartnerOrderTransactionDetail>()
                        {
                            new ChannelPartnerOrderTransactionDetail() { Name = "AVS Code", Value = "X" },
                            new ChannelPartnerOrderTransactionDetail() { Name = "Authorization Code", Value = "123456" },
                            new ChannelPartnerOrderTransactionDetail() { Name = "CVV Code", Value = "M" },
                            new ChannelPartnerOrderTransactionDetail() { Name = "Response Code", Value = "Authorized" },
                            new ChannelPartnerOrderTransactionDetail() { Name = "Reason Code", Value = "1" },
                            new ChannelPartnerOrderTransactionDetail() { Name = "Response Subcode", Value = "1" },
                            new ChannelPartnerOrderTransactionDetail() { Name = "Transaction ID", Value = "1234567890" }
                        }
                    },
                TreatWarningsAsErrors = true,
            };
            
            var response = api.ImportChannelPartnerOrder(order);
            return response;
        }        
    }
}