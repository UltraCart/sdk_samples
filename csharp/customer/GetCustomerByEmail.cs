using System;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.customer
{
    public class GetCustomerByEmail
    {
        /**
         * Of the two GetCustomer methods, you'll probably always use this one over GetCustomer.
         * Most customer logic revolves around the email, not the customer oid. The latter is only meaningful as a primary
         * key in the UltraCart databases. But our sample functions return back the oid, so we'll ignore that and just
         * use the email that we create.
         */
        public static void Execute()
        {
            try
            {
                string email = CustomerFunctions.CreateRandomEmail();
                int customerOid = CustomerFunctions.InsertSampleCustomer(email);
                CustomerApi customerApi = Samples.GetCustomerApi();

                // the _expand variable is set to return just the address fields.
                // see CustomerFunctions for a list of expansions, or consult the source: https://www.ultracart.com/api/
                CustomerResponse apiResponse = customerApi.GetCustomerByEmail(email, "billing,shipping");
                Customer customer = apiResponse.Customer; // assuming this succeeded

                Console.WriteLine(customer);

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