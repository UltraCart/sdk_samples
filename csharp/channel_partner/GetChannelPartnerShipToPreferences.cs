using System;
using System.Reflection;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.channel_partner
{
    public class GetChannelPartnerShipToPreferences
    {
        /*
         Retrieves all shipto preferences for a channel partner.
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
                var apiResponse = channelPartnerApi.GetChannelPartnerShipToPreferences(channelPartnerOid);
                
                if (apiResponse.Error != null)
                {
                    Console.Error.WriteLine(apiResponse.Error.DeveloperMessage);
                    Console.Error.WriteLine(apiResponse.Error.UserMessage);
                    Environment.Exit(1);
                }
                
                var preferences = apiResponse.ShipToPreferences;
                
                foreach (var preference in preferences)
                {
                    Console.WriteLine(preference);
                }
                
                Console.WriteLine($"Retrieved {preferences.Count} ship to preferences");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                Console.WriteLine(ex.StackTrace);
            }
        }
    }
}