package channel_partner;

import com.ultracart.admin.v2.ChannelPartnerApi;
import com.ultracart.admin.v2.models.ChannelPartnerShipToPreference;
import com.ultracart.admin.v2.models.ChannelPartnerShipToPreferenceResponse;

import java.util.ArrayList;

public class InsertChannelPartnerShipToPreference {
    /*
     Inserts a channel partner shipto preference for a channel partner.
     These preferences are used by EDI channel partners to automatically
     apply return policies and add additional free items to EDI orders based on the EDI code that is present.

     Possible Errors:
     Attempting to interact with a channel partner other than the one tied to your API Key:
        "Invalid channel_partner_oid specified.  Your REST API key may only interact with channel_partner_oid: 12345"
     Supplying a bad channel partner oid: "Invalid channel_partner_oid specified."
    */
    public static void execute() {
        System.out.println("--- InsertChannelPartnerShipToPreference ---");

        try {
            // Create channel partner API instance using API key
            ChannelPartnerApi channelPartnerApi = new ChannelPartnerApi(common.Constants.CHANNEL_PARTNER_API_KEY);

            int channelPartnerOid = 12345;

            ChannelPartnerShipToPreference preference = new ChannelPartnerShipToPreference();
            preference.setChannelPartnerOid(channelPartnerOid);
            preference.setShipToEdiCode("EDI_CODE_HERE");
            preference.setReturnPolicy("This is some return policy text that will be printed on the packing slip.");

            ArrayList<String> additionalKitComponentItemIds = new ArrayList<String>();
            additionalKitComponentItemIds.add("ITEM_ID1");
            additionalKitComponentItemIds.add("ITEM_ID2");
            additionalKitComponentItemIds.add("ITEM_ID3");
            preference.setAdditionalKitComponentItemIds(additionalKitComponentItemIds);

            preference.setDescription("This is a merchant friendly description to help me remember what the above setting are.");

            ChannelPartnerShipToPreferenceResponse apiResponse = channelPartnerApi.insertChannelPartnerShipToPreference(channelPartnerOid, preference);

            if (apiResponse.getError() != null) {
                System.err.println(apiResponse.getError().getDeveloperMessage());
                System.err.println(apiResponse.getError().getUserMessage());
                System.exit(1);
            }

            ChannelPartnerShipToPreference insertedPreference = apiResponse.getShipToPreference();

            // This should equal what you submitted.
            System.out.println(insertedPreference);
            System.out.println("Ship to preference inserted successfully");
        }
        catch (Exception ex) {
            System.out.println("Error: " + ex.getMessage());
            ex.printStackTrace();
        }
    }
}