using System;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.checkout
{
    public class RegisterAffiliateClick
    {
        public static void Execute()
        {
            // Reference Implementation: https://github.com/UltraCart/responsive_checkout
            // Records an affiliate click.

            CheckoutApi checkoutApi = new CheckoutApi(Constants.ApiKey);

            RegisterAffiliateClickRequest clickRequest = new RegisterAffiliateClickRequest();
            
            // Note: In C#, you'll need to get these values from your HttpContext
            // This is a simplified example - implement proper request handling in your application
            string ipAddress = "127.0.0.1"; // Replace with actual implementation to get IP
            string userAgent = ""; // Replace with actual implementation to get user agent
            string refererUrl = ""; // Replace with actual implementation to get referer URL
            
            clickRequest.IpAddress = ipAddress;
            clickRequest.UserAgent = userAgent;
            clickRequest.ReferrerUrl = refererUrl;
            clickRequest.Affid = 123456789; // you should know this from your UltraCart affiliate system.
            clickRequest.Subid = "TODO:SupplyThisValue";
            // clickRequest.LandingPageUrl = null;  // if you have landing page url.

            RegisterAffiliateClickResponse apiResponse = checkoutApi.RegisterAffiliateClick(clickRequest);
            Console.WriteLine(Newtonsoft.Json.JsonConvert.SerializeObject(apiResponse, Newtonsoft.Json.Formatting.Indented));
            
        }
    }
}