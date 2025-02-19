using System;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Client;
using com.ultracart.admin.v2.Model;

namespace SdkSample.customer
{
    public class MergeCustomer
    {
        public static void Execute()
        {
            /*
                The merge function was requested by UltraCart merchants that sell software and manage activation keys.  Frequently,
                customers would purchase their software using one email address, and then accidentally re-subscribe using a
                different email address (for example, they purchased subsequent years using PayPal which was tied to their spouse's
                email).  However it happened, the customer now how software licenses spread across multiple emails and therefore
                multiple customer profiles.

                merge combine the customer profiles, merging order history and software entitlements.  Still, it may be used to
                combine any two customer profiles for any reason.

                Success returns back a status code 204 (No Content)
             */

            try
            {
                // first customer
                int firstCustomerOid = CustomerFunctions.InsertSampleCustomer();

                string secondEmail = CustomerFunctions.CreateRandomEmail();
                int secondCustomerOid = CustomerFunctions.InsertSampleCustomer(secondEmail);

                CustomerMergeRequest mergeRequest = new CustomerMergeRequest();
                // Supply either the email or the customer oid.  Only need one.
                mergeRequest.Email = secondEmail;
                // mergeRequest.CustomerProfileOid = customerOid;

                CustomerApi customerApi = new CustomerApi(Constants.ApiKey);
                customerApi.MergeCustomer(firstCustomerOid, mergeRequest);

                // clean up this sample.
                CustomerFunctions.DeleteSampleCustomer(firstCustomerOid);
                // Notice: No need to delete the second sample.  The merge call deletes it.
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