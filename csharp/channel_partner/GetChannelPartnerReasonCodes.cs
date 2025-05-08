using System;
using System.Reflection;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.channel_partner
{
    public class GetChannelPartnerReasonCodes
    {
        /*
         * Retrieve a list of all refund and reject reason codes configured by the merchant.  These might be required when doing a refund.
         */
        public static void Execute()
        {
            Console.WriteLine("--- " + MethodBase.GetCurrentMethod()?.DeclaringType?.Name + " ---");
            
            try
            {
                // Create channel partner API instance using API key
                ChannelPartnerApi channelPartnerApi = new ChannelPartnerApi(Constants.ChannelPartnerApiKey);
                var apiResponse = channelPartnerApi.GetChannelPartnerReasonCodes(18413);
                
                if (apiResponse.Error != null)
                {
                    Console.Error.WriteLine(apiResponse.Error.DeveloperMessage);
                    Console.Error.WriteLine(apiResponse.Error.UserMessage);
                    Environment.Exit(1);
                }
                
                var rejectReasons = apiResponse.OrderLevelRejectReasons;
                var refundReasons = apiResponse.OrderLevelRefundReasons;
                
                foreach (var reason in refundReasons)
                {
                    Console.WriteLine(reason);
                }
                
                Console.WriteLine($"Retrieved {refundReasons.Count} refund reasons");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                Console.WriteLine(ex.StackTrace);
            }
        }
    }
}