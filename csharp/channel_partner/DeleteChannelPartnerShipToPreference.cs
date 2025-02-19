using System;
using System.Reflection;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.channel_partner
{
    public class DeleteChannelPartnerShipToPreference
    {
        /*
         Deletes a ChannelPartnerShiptoPreference.  These preferences are used by EDI channel partners to automatically
         apply return policies and add additional free items to EDI orders based on the EDI code that is present.

         Success will return a status code 204 (No content)

         Possible Errors:
         Attempting to interact with a channel partner other than the one tied to your API Key:
            "Invalid channel_partner_oid specified.  Your REST API key may only interact with channel_partner_oid: 12345"
         Supply a bad preference oid: "Invalid channel_partner_ship_to_preference_oid specified."
        */
        public static void Execute()
        {
            Console.WriteLine("--- " + MethodBase.GetCurrentMethod()?.DeclaringType?.Name + " ---");
            
            try
            {
                // Create channel partner API instance using API key
                ChannelPartnerApi channelPartnerApi = new ChannelPartnerApi(Constants.ChannelPartnerApiKey);
                
                int channelPartnerShiptoPreferenceOid = 67890; // you will usually get this by calling getChannelPartnerShipToPreferences()
                int channelPartnerOid = 12345;
                
                channelPartnerApi.DeleteChannelPartnerShipToPreference(channelPartnerOid, channelPartnerShiptoPreferenceOid);
                Console.WriteLine("Channel partner ship to preference deleted successfully");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                Console.WriteLine(ex.StackTrace);
            }
        }
    }
}