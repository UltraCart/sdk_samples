using System;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.channel_partner
{
    // ReSharper disable once ClassNeverInstantiated.Global
    public class CancelOrderByChannelPartnerOrderId
    {
        // uncomment to run.  C# projects can only have one main.
        // To run channel partner examples, you will need:
        // 1) An API Key: https://secure.ultracart.com/merchant/configuration/apiManagementApp.do
        // 2) That API Key must be assigned to a channel partner: https://secure.ultracart.com/merchant/configuration/customChannelPartnerListLoad.do
        // public static void Main()
        // {
        //     var result = CancelOrderByChannelPartnerOrderIdCall();
        //     if (result.Success == true)
        //     {
        //         Console.WriteLine("Order was deleted successfully.");
        //     }
        //     else
        //     {
        //         if (result.CancelErrors != null)
        //         {
        //             Console.WriteLine("Order was not deleted.  Cancel Errors follow:");
        //             foreach (var error in result.CancelErrors)
        //             {
        //                 Console.WriteLine(error);
        //             }
        //         }
        //
        //         if (result.Error != null)
        //         {
        //             Console.WriteLine("System Error, if any: " + result.Error.DeveloperMessage);    
        //         }
        //     }
        //     
        // }

        // ReSharper disable once MemberCanBePrivate.Global
        public static ChannelPartnerCancelResponse CancelOrderByChannelPartnerOrderIdCall()
        {
            var api = new ChannelPartnerApi(Constants.ApiKey);
            var channelPartnerOrderId = "widget-1245-abc-1";
            var response = api.CancelOrderByChannelPartnerOrderId(channelPartnerOrderId);
            return response;
        }
    }
}