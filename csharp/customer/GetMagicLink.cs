using System;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;
using System.Web;
using com.ultracart.admin.v2.Client;

namespace SdkSample.customer
{
    public class GetMagicLink
    {
        public static void Execute()
        {
            /*
                getMagicLink returns back a url whereby a merchant can log into their website as the customer.
                This may be useful to "see what the customer is seeing" and is the only method to do so since
                the customer's passwords are encrypted.  Note: A merchant may also do this using the UltraCart
                backend site within the Customer Management section.
             */

            try
            {
                CustomerApi customerApi = new CustomerApi(Constants.ApiKey);

                // create a customer
                int customerOid = CustomerFunctions.InsertSampleCustomer();
                string storefront = "www.website.com";  // required.  many merchants have dozens of storefronts. which one?

                CustomerMagicLinkResponse apiResponse = customerApi.GetMagicLink(customerOid, storefront);
                string url = apiResponse.Url;

                Console.WriteLine("<html><body><script>window.location.href = " + HttpUtility.UrlEncode(url) + ";</script></body></html>");

                // clean up this sample. - don't do this or the above magic link won't work.  But you'll want to clean up this
                // sample customer manually using the backend.
                // CustomerFunctions.DeleteSampleCustomer(customerOid);

            }
            catch (ApiException e)
            {
                Console.WriteLine("An ApiException occurred.  Please review the following error:");
                Console.WriteLine(e); // <-- change_me: handle gracefully
                Environment.Exit(1);
            }
        }
    }
}