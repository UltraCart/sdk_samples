using System;
using System.Collections.Generic;
using System.Reflection;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.channel_partner
{
    public class EstimateShippingForChannelPartnerOrder
    {
        /*
         This is a helper function for call centers to calculate the shipping cost on an order.  In a typical flow, the call center
         will collect all the shipping information and items being purchased into a ChannelPartnerOrder object.
         They will then call this method, passing in the order object.  The response will contain the shipping estimates
         that the call center can present to the customer.  Once the customer selects a particulate estimate,
         they can then plug that cost into their call center application and complete the order.

         Possible Errors:
         Using an API key that is not tied to a channel partner: "This API Key does not have permission to interact with channel partner orders.  Please review your Channel Partner configuration."
         Order has invalid channel partner code: "Invalid channel partner code"
         Order has no items: "null order.items passed." or "order.items array contains a null entry."
         Order has no channel partner order id: "order.channelPartnerOrderId must be specified."
         Order channel partner order id is a duplicate:  "order.channelPartnerOrderId [XYZ] already used."
         Channel Partner is inactive: "partner is inactive."
        */
        public static void Execute()
        {
            Console.WriteLine("--- " + MethodBase.GetCurrentMethod()?.DeclaringType?.Name + " ---");
            
            try
            {
                // Create channel partner API instance using API key
                ChannelPartnerApi channelPartnerApi = new ChannelPartnerApi(Constants.ChannelPartnerApiKey);
                
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
                
                var apiResponse = channelPartnerApi.EstimateShippingForChannelPartnerOrder(order);
                var estimates = apiResponse.Estimates;
                
                // TODO: Apply one estimate shipping method (name) and cost to your channel partner order.
                
                // Display shipping estimates
                foreach (var estimate in estimates)
                {
                    Console.WriteLine(estimate);
                }
                
                Console.WriteLine($"Retrieved {estimates.Count} shipping estimates");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                Console.WriteLine(ex.StackTrace);
            }
        }
    }
}