package channel_partner;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ultracart.admin.v2.ChannelPartnerApi;
import com.ultracart.admin.v2.models.ChannelPartnerShipToPreference;
import com.ultracart.admin.v2.models.ChannelPartnerShipToPreferenceResponse;

import java.util.ArrayList;

public class UpdateChannelPartnerShipToPreference {
    /**
     * Updates a channel partner shipto preference for a channel partner.
     * These preferences are used by EDI channel partners to automatically
     * apply return policies and add additional free items to EDI orders based on the EDI code that is present.
     *
     * Possible Errors:
     * Attempting to interact with a channel partner other than the one tied to your API Key:
     *    "Invalid channel_partner_oid specified.  Your REST API key may only interact with channel_partner_oid: 12345"
     * Supplying a bad channel partner oid: "Invalid channel_partner_oid specified."
     */
    public static void execute() {
        try {
            ChannelPartnerApi channelPartnerApi = new ChannelPartnerApi(common.Constants.CHANNEL_PARTNER_API_KEY);
            int channelPartnerOid = 12345;
            int channelPartnerShipToPreferenceOid = 67890;

            ChannelPartnerShipToPreferenceResponse apiResponse = channelPartnerApi.getChannelPartnerShipToPreference(
                channelPartnerOid,
                channelPartnerShipToPreferenceOid);

            ChannelPartnerShipToPreference preference = apiResponse.getShipToPreference();

            // Update some fields.
            preference.setShipToEdiCode("EDI_CODE_HERE");
            preference.setReturnPolicy("This is some return policy text that will be printed on the packing slip.");

            ArrayList<String> additionalKitComponentItemIds = new ArrayList<String>();
            additionalKitComponentItemIds.add("ITEM_ID1");
            additionalKitComponentItemIds.add("ITEM_ID2");
            additionalKitComponentItemIds.add("ITEM_ID3");
            preference.setAdditionalKitComponentItemIds(additionalKitComponentItemIds);

            preference.setDescription("This is a merchant friendly description to help me remember what the above setting are.");

            apiResponse = channelPartnerApi.updateChannelPartnerShipToPreference(
                channelPartnerOid,
                channelPartnerShipToPreferenceOid,
                preference);

            if (apiResponse.getError() != null) {
                System.err.println(apiResponse.getError().getDeveloperMessage());
                System.err.println(apiResponse.getError().getUserMessage());
                System.exit(1);
            }

            ChannelPartnerShipToPreference updatedPreference = apiResponse.getShipToPreference();

            // This should equal what you submitted.
            ObjectMapper mapper = new ObjectMapper();
            System.out.println(mapper.writerWithDefaultPrettyPrinter().writeValueAsString(updatedPreference));
        }
        catch (Exception ex) {
            System.out.println("Error: " + ex.getMessage());
            ex.printStackTrace();
        }
    }
}