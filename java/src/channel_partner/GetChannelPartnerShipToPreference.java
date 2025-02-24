package channel_partner;

import com.ultracart.admin.v2.ChannelPartnerApi;
import com.ultracart.admin.v2.models.ChannelPartnerShipToPreference;
import com.ultracart.admin.v2.models.ChannelPartnerShipToPreferenceResponse;

public class GetChannelPartnerShipToPreference {
    /*
     Retrieves a shipto preference for a channel partner.
     These preferences are used by EDI channel partners to automatically
     apply return policies and add additional free items to EDI orders based on the EDI code that is present.

     Possible Errors:
     Attempting to interact with a channel partner other than the one tied to your API Key:
        "Invalid channel_partner_oid specified.  Your REST API key may only interact with channel_partner_oid: 12345"
     Supplying a bad channel partner oid: "Invalid channel_partner_oid specified."
     Supplying a bad channel partner shipto preference oid: "Invalid channel_partner_ship_to_preference_oid specified."
    */
    public static void execute() {
        System.out.println("--- GetChannelPartnerShipToPreference ---");

        try {
            // Create channel partner API instance using API key
            ChannelPartnerApi channelPartnerApi = new ChannelPartnerApi(common.Constants.CHANNEL_PARTNER_API_KEY);

            int channelPartnerOid = 12345;
            int channelPartnerShiptoPreferenceOid = 67890;

            ChannelPartnerShipToPreferenceResponse apiResponse = channelPartnerApi.getChannelPartnerShipToPreference(channelPartnerOid, channelPartnerShiptoPreferenceOid);

            if (apiResponse.getError() != null) {
                System.err.println(apiResponse.getError().getDeveloperMessage());
                System.err.println(apiResponse.getError().getUserMessage());
                System.exit(1);
            }

            ChannelPartnerShipToPreference preference = apiResponse.getShipToPreference();
            System.out.println(preference);
        }
        catch (Exception ex) {
            System.out.println("Error: " + ex.getMessage());
            ex.printStackTrace();
        }
    }
}