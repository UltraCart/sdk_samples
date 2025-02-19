using System;
using System.Reflection;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.channel_partner
{
    public class GetChannelPartnerOrderByChannelPartnerOrderId
    {
        /*
         * ChannelPartnerApi.getChannelPartnerOrderByChannelPartnerOrderId() retrieves a single order for a given
         * channel partner order_id.  This might be useful for call centers which only have their order ids and not UltraCart's.
         * It is identical to the OrderApi.getOrder() call in functionality and result,
         * but allows for a restricted permission set.  The channel partner api assumes a tie to a Channel Partner and
         * only allows retrieval of orders created by that Channel Partner.
         */
        public static void Execute()
        {
            Console.WriteLine("--- " + MethodBase.GetCurrentMethod()?.DeclaringType?.Name + " ---");
            
            try
            {
                // Create channel partner API instance using API key
                ChannelPartnerApi channelPartnerApi = new ChannelPartnerApi(Constants.ChannelPartnerApiKey);
                
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
                string expansion = "item,summary,shipping";
                
                // This order MUST be an order associated with this channel partner or you will receive a 400 Bad Request.
                string channelPartnerOrderId = "MY-CALL-CENTER-BLAH-BLAH";
                var apiResponse = channelPartnerApi.GetChannelPartnerOrderByChannelPartnerOrderId(channelPartnerOrderId, expansion);
                
                if (apiResponse.Error != null)
                {
                    Console.Error.WriteLine(apiResponse.Error.DeveloperMessage);
                    Console.Error.WriteLine(apiResponse.Error.UserMessage);
                    Environment.Exit(1);
                }
                
                Order order = apiResponse.Order;
                Console.WriteLine(order);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                Console.WriteLine(ex.StackTrace);
            }
        }
    }
}