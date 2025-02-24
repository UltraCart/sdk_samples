package channel_partner;

import com.ultracart.admin.v2.ChannelPartnerApi;
import com.ultracart.admin.v2.models.ChannelPartnerShipToPreference;
import com.ultracart.admin.v2.models.ChannelPartnerShipToPreferencesResponse;

import java.util.List;

public class GetChannelPartnerShipToPreferences {
  /*
   Retrieves all shipto preferences for a channel partner.
   These preferences are used by EDI channel partners to automatically
   apply return policies and add additional free items to EDI orders based on the EDI code that is present.

   Possible Errors:
   Attempting to interact with a channel partner other than the one tied to your API Key:
      "Invalid channel_partner_oid specified.  Your REST API key may only interact with channel_partner_oid: 12345"
   Supplying a bad channel partner oid: "Invalid channel_partner_oid specified."
  */
  public static void execute() {
    System.out.println("--- GetChannelPartnerShipToPreferences ---");

    try {
      // Create channel partner API instance using API key
      ChannelPartnerApi channelPartnerApi = new ChannelPartnerApi(common.Constants.CHANNEL_PARTNER_API_KEY);

      int channelPartnerOid = 12345;
      ChannelPartnerShipToPreferencesResponse apiResponse = channelPartnerApi.getChannelPartnerShipToPreferences(channelPartnerOid);

      if (apiResponse.getError() != null) {
        System.err.println(apiResponse.getError().getDeveloperMessage());
        System.err.println(apiResponse.getError().getUserMessage());
        System.exit(1);
      }

      List<ChannelPartnerShipToPreference> preferences = apiResponse.getShipToPreferences();

      for (ChannelPartnerShipToPreference preference : preferences) {
        System.out.println(preference);
      }

      System.out.println("Retrieved " + preferences.size() + " ship to preferences");
    } catch (Exception ex) {
      System.out.println("Error: " + ex.getMessage());
      ex.printStackTrace();
    }
  }
}