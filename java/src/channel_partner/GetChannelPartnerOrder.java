package channel_partner;

import com.ultracart.admin.v2.ChannelPartnerApi;
import com.ultracart.admin.v2.models.Order;
import com.ultracart.admin.v2.models.OrderResponse;

public class GetChannelPartnerOrder {
    /*
     * ChannelPartnerApi.getChannelPartnerOrder() retrieves a single order for a given order_id.  It is identical to the
     * OrderApi.getOrder() call, but allows for a restricted permission set.  The channel partner api assumes
     * a tie to a Channel Partner and only allows retrieval of orders created by that Channel Partner.
     */
    public static void execute() {
        System.out.println("--- GetChannelPartnerOrder ---");

        try {
            // Create channel partner API instance using API key
            ChannelPartnerApi channelPartnerApi = new ChannelPartnerApi(common.Constants.CHANNEL_PARTNER_API_KEY);

            // The expansion variable instructs UltraCart how much information to return.  The order object is large and
            // while it's easily manageable for a single order, when querying thousands of orders, is useful to reduce
            // payload size.
            // see www.ultracart.com/api/ for all the expansion fields available (this list below may become stale)
            /*
            Possible Order Expansions:
            affiliate           affiliate.ledger                    auto_order
            billing             channel_partner                     checkout
            coupon              customer_profile                    digital_order
            edi                 fraud_score                         gift
            gift_certificate    internal                            item
            linked_shipment     marketing                           payment
            payment.transaction quote                               salesforce
            shipping            shipping.tracking_number_details    summary
            taxes
            */

            // A channel partner will almost always query an order for the purpose of turning around and submitting it to a refund call.
            // As such, the expansion most likely needed is listed below.
            String expansion = "item,summary,shipping";

            // This order MUST be an order associated with this channel partner or you will receive a 400 Bad Request.
            String orderId = "DEMO-0009110366";
            OrderResponse apiResponse = channelPartnerApi.getChannelPartnerOrder(orderId, expansion);

            if (apiResponse.getError() != null) {
                System.err.println(apiResponse.getError().getDeveloperMessage());
                System.err.println(apiResponse.getError().getUserMessage());
                System.exit(1);
            }

            Order order = apiResponse.getOrder();
            System.out.println(order);
        }
        catch (Exception ex) {
            System.out.println("Error: " + ex.getMessage());
            ex.printStackTrace();
        }
    }
}