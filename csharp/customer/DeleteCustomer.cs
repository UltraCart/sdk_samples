using System;
using com.ultracart.admin.v2.Api;

namespace SdkSample.customer
{
    public class DeleteCustomer
    {
        public static void Execute()
        {
            try
            {
                int customerOid = CustomerFunctions.InsertSampleCustomer();
                CustomerFunctions.DeleteSampleCustomer(customerOid);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine("An Exception occurred. Please review the following error:");
                Console.Error.WriteLine(ex); // <-- change_me: handle gracefully
                Environment.Exit(1);
            }
        }
    }
}