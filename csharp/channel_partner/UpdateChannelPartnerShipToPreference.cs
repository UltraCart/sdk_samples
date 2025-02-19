using System;
using System.Collections.Generic;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;
using Newtonsoft.Json;

namespace SdkSample.channel_partner
{
    public class UpdateChannelPartnerShipToPreference
    {
        /// <summary>
        /// Updates a channel partner shipto preference for a channel partner.
        /// These preferences are used by EDI channel partners to automatically
        /// apply return policies and add additional free items to EDI orders based on the EDI code that is present.
        /// 
        /// Possible Errors:
        /// Attempting to interact with a channel partner other than the one tied to your API Key:
        ///    "Invalid channel_partner_oid specified.  Your REST API key may only interact with channel_partner_oid: 12345"
        /// Supplying a bad channel partner oid: "Invalid channel_partner_oid specified."
        /// </summary>
        public static void Execute()
        {
            ChannelPartnerApi channelPartnerApi = new ChannelPartnerApi(Constants.ChannelPartnerApiKey);
            int channelPartnerOid = 12345;
            int channelPartnerShipToPreferenceOid = 67890;

            ChannelPartnerShipToPreferenceResponse apiResponse = channelPartnerApi.GetChannelPartnerShipToPreference(
                channelPartnerOid, 
                channelPartnerShipToPreferenceOid);

            ChannelPartnerShipToPreference preference = apiResponse.ShipToPreference;
            
            // Update some fields.
            preference.ShipToEdiCode = "EDI_CODE_HERE";
            preference.ReturnPolicy = "This is some return policy text that will be printed on the packing slip.";
            preference.AdditionalKitComponentItemIds = new List<string> { "ITEM_ID1", "ITEM_ID2", "ITEM_ID3" };
            preference.Description = "This is a merchant friendly description to help me remember what the above setting are.";

            apiResponse = channelPartnerApi.UpdateChannelPartnerShipToPreference(
                channelPartnerOid, 
                channelPartnerShipToPreferenceOid, 
                preference);

            if (apiResponse.Error != null)
            {
                Console.Error.WriteLine(apiResponse.Error.DeveloperMessage);
                Console.Error.WriteLine(apiResponse.Error.UserMessage);
                Environment.Exit(1);
            }

            ChannelPartnerShipToPreference updatedPreference = apiResponse.ShipToPreference;

            // This should equal what you submitted.
            Console.WriteLine(JsonConvert.SerializeObject(updatedPreference, Formatting.Indented));
        }
    }
}