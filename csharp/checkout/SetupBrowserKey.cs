using System;
using System.Collections.Generic;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.checkout
{
    public class SetupBrowserKey
    {
        public static void Execute()
        {
            /*
                This is a checkout api method.  It creates a browser key for use in a client side checkout.  This call must be
                made server side with a Simple API Key or an OAuth access_token.
             */

            CheckoutApi checkoutApi = new CheckoutApi(Constants.ApiKey);

            CheckoutSetupBrowserKeyRequest keyRequest = new CheckoutSetupBrowserKeyRequest();
            keyRequest.AllowedReferrers = new List<string> { "https://www.mywebsite.com" };
            string browserKey = checkoutApi.SetupBrowserKey(keyRequest).BrowserKey;

            Console.WriteLine("<html lang=\"en\"><body><pre>");
            Console.WriteLine(browserKey);
            Console.WriteLine("</pre></body></html>");
        }
    }
}