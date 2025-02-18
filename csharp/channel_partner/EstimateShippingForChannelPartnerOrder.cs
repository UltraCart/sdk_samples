using System;
using System.Collections.Generic;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.channel_partner
{
    // ReSharper disable once ClassNeverInstantiated.Global
    public class EstimateShippingForChannelPartnerOrder
    {
        // uncomment to run.  C# projects can only have one main.
        // To run channel partner examples, you will need:
        // 1) An API Key: https://secure.ultracart.com/merchant/configuration/apiManagementApp.do
        // 2) That API Key must be assigned to a channel partner: https://secure.ultracart.com/merchant/configuration/customChannelPartnerListLoad.do
        // public static void Main()
        // {
        //     var result = EstimateShippingForChannelPartnerOrderCall();
        //     if (result.Success == true)
        //     {
        //         foreach (var estimate in result.Estimates)
        //         {
        //             Console.Out.WriteLine(estimate.ShippingMethod + ": " + estimate.ShippingHandlingTotal);
        //         }
        //     }
        //     else
        //     {
        //         Console.Out.WriteLine("Error:");
        //         Console.Out.WriteLine(result.Error.DeveloperMessage);
        //     }
        //     // Utility.DumpObject(result, "Shipping Estimate Result");
        // }

        // ReSharper disable once MemberCanBePrivate.Global
        // This method constructs an order from a call center that wishes to present shipping options to a customer.
        // Only those properties needed to estimate shipping are populated here.  Those are the shipping address
        // and the items.
        public static ChannelPartnerEstimateShippingResponse EstimateShippingForChannelPartnerOrderCall()
        {
            var api = new ChannelPartnerApi(Constants.ApiKey);
            
            // The spreadsheet import docs will serve you well here.
            // https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377246/Channel+Partner+API+-+Spreadsheet+Import
            
            ChannelPartnerOrder order = new ChannelPartnerOrder()
            {
                ChannelPartnerOrderId = "widget-1245-abc-1",
                Coupons = new List<string>() { "10OFF" },
                // DeliveryDate will impact shipping estimates if there is a delivery deadline.  
                // DeliveryDate =
                //    DateTime.Now.AddDays(14).ToString("s", System.Globalization.CultureInfo.InvariantCulture),
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
                // ShipOnDate = DateTime.Now.AddDays(7).ToString("s", System.Globalization.CultureInfo.InvariantCulture),
                ShipToResidential = true,
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
                ShiptoTitle = "Director"
            };

            
            var response = api.EstimateShippingForChannelPartnerOrder(order);
            return response;
        }
        
    }
}