using System;
using System.Collections.Generic;
using System.Reflection;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.channel_partner
{
    public class InsertChannelPartnerShipToPreference
    {
        /*
         Inserts a channel partner shipto preference for a channel partner.
         These preferences are used by EDI channel partners to automatically
         apply return policies and add additional free items to EDI orders based on the EDI code that is present.

         Possible Errors:
         Attempting to interact with a channel partner other than the one tied to your API Key:
            "Invalid channel_partner_oid specified.  Your REST API key may only interact with channel_partner_oid: 12345"
         Supplying a bad channel partner oid: "Invalid channel_partner_oid specified."
        */
        public static void Execute()
        {
            Console.WriteLine("--- " + MethodBase.GetCurrentMethod()?.DeclaringType?.Name + " ---");
            
            try
            {
                // Create channel partner API instance using API key
                ChannelPartnerApi channelPartnerApi = new ChannelPartnerApi(Constants.ChannelPartnerApiKey);
                
                int channelPartnerOid = 12345;
                
                ChannelPartnerShipToPreference preference = new ChannelPartnerShipToPreference();
                preference.ChannelPartnerOid = channelPartnerOid;
                preference.ShipToEdiCode = "EDI_CODE_HERE";
                preference.ReturnPolicy = "This is some return policy text that will be printed on the packing slip.";
                preference.AdditionalKitComponentItemIds = new List<string> { "ITEM_ID1", "ITEM_ID2", "ITEM_ID3" };
                preference.Description = "This is a merchant friendly description to help me remember what the above setting are.";
                
                var apiResponse = channelPartnerApi.InsertChannelPartnerShipToPreference(channelPartnerOid, preference);
                
                if (apiResponse.Error != null)
                {
                    Console.Error.WriteLine(apiResponse.Error.DeveloperMessage);
                    Console.Error.WriteLine(apiResponse.Error.UserMessage);
                    Environment.Exit(1);
                }
                
                var insertedPreference = apiResponse.ShipToPreference;
                
                // This should equal what you submitted.
                Console.WriteLine(insertedPreference);
                Console.WriteLine("Ship to preference inserted successfully");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                Console.WriteLine(ex.StackTrace);
            }
        }
    }
}