using System;
using System.Reflection;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.channel_partner
{
    public class GetChannelPartners
    {
        /*
            Retrieves a list of all channel partners configured for this merchant.  If the API KEY used is tied to a specific
            Channel Partner, then the results will contain only that Channel Partner.
         */
        public static void Execute()
        {
            Console.WriteLine("--- " + MethodBase.GetCurrentMethod()?.DeclaringType?.Name + " ---");
            
            try
            {
                // Create channel partner API instance using API key
                ChannelPartnerApi channelPartnerApi = new ChannelPartnerApi(Constants.ChannelPartnerApiKey);
                var apiResponse = channelPartnerApi.GetChannelPartners();
                
                if (apiResponse.Error != null)
                {
                    Console.Error.WriteLine(apiResponse.Error.DeveloperMessage);
                    Console.Error.WriteLine(apiResponse.Error.UserMessage);
                    Environment.Exit(1);
                }
                
                var channelPartners = apiResponse.ChannelPartners;
                
                foreach (var channelPartner in channelPartners)
                {
                    Console.WriteLine(channelPartner);
                }
                
                Console.WriteLine($"Retrieved {channelPartners.Count} channel partners");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                Console.WriteLine(ex.StackTrace);
            }
        }
    }
}