package channel_partner;

import com.ultracart.admin.v2.ChannelPartnerApi;
import com.ultracart.admin.v2.models.ChanelPartnerReasonCodesResponse;
import com.ultracart.admin.v2.models.OrderReason;

import java.util.List;

public class GetChannelPartnerReasonCodes {
    /*
     * ChannelPartnerApi.getChannelPartnerOrder() retrieves a single order for a given order_id.  It is identical to the
     * OrderApi.getOrder() call, but allows for a restricted permission set.  The channel partner api assumes
     * a tie to a Channel Partner and only allows retrieval of orders created by that Channel Partner.
     */
    public static void execute() {
        System.out.println("--- GetChannelPartnerReasonCodes ---");

        try {
            // Create channel partner API instance using API key
            ChannelPartnerApi channelPartnerApi = new ChannelPartnerApi(common.Constants.CHANNEL_PARTNER_API_KEY);

            ChanelPartnerReasonCodesResponse apiResponse = channelPartnerApi.getChannelPartnerReasonCodes(18413);

            if (apiResponse.getError() != null) {
                System.err.println(apiResponse.getError().getDeveloperMessage());
                System.err.println(apiResponse.getError().getUserMessage());
                System.exit(1);
            }

            List<OrderReason> refundReasons = apiResponse.getItemLevelRefundReasons();
            for (OrderReason refundReason : refundReasons) {
                System.out.println(refundReason);
            }

        }
        catch (Exception ex) {
            System.out.println("Error: " + ex.getMessage());
            ex.printStackTrace();
        }
    }
}