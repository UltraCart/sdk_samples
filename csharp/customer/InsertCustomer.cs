using System;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Client;
using com.ultracart.admin.v2.Model;

namespace SdkSample.customer
{
    public class InsertCustomer
    {
        public static void Execute()
        {
            try
            {
                int customerOid = CustomerFunctions.InsertSampleCustomer();
                CustomerFunctions.DeleteSampleCustomer(customerOid);
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