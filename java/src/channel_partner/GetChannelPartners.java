package channel_partner;

import com.ultracart.admin.v2.ChannelPartnerApi;
import com.ultracart.admin.v2.models.ChannelPartner;
import com.ultracart.admin.v2.models.ChannelPartnersResponse;

import java.util.List;

public class GetChannelPartners {
  /*
      Retrieves a list of all channel partners configured for this merchant.  If the API KEY used is tied to a specific
      Channel Partner, then the results will contain only that Channel Partner.
   */
  public static void execute() {
    System.out.println("--- GetChannelPartners ---");

    try {
      // Create channel partner API instance using API key
      ChannelPartnerApi channelPartnerApi = new ChannelPartnerApi(common.Constants.CHANNEL_PARTNER_API_KEY);
      ChannelPartnersResponse apiResponse = channelPartnerApi.getChannelPartners();

      if (apiResponse.getError() != null) {
        System.err.println(apiResponse.getError().getDeveloperMessage());
        System.err.println(apiResponse.getError().getUserMessage());
        System.exit(1);
      }

      List<ChannelPartner> channelPartners = apiResponse.getChannelPartners();

      for (ChannelPartner channelPartner : channelPartners) {
        System.out.println(channelPartner);
      }

      System.out.println("Retrieved " + channelPartners.size() + " channel partners");
    } catch (Exception ex) {
      System.out.println("Error: " + ex.getMessage());
      ex.printStackTrace();
    }
  }
}