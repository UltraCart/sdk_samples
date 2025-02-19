using System;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Client;
using com.ultracart.admin.v2.Model;

namespace SdkSample.customer
{
    public class UpdateCustomer
    {
        public static void Execute()
        {
            try
            {
                int customerOid = CustomerFunctions.InsertSampleCustomer();

                CustomerApi customerApi = new CustomerApi(Constants.ApiKey);
                // just want address fields.  see https://www.ultracart.com/api/#resource_customer.html for all expansion values
                string expand = "billing,shipping";
                Customer customer = customerApi.GetCustomer(customerOid, expand).Customer;
                // TODO: do some edits to the customer.  Here we will change some billing fields.
                customer.Billing[0].Address2 = "Apartment 101";

                // notice expand is passed to update as well since it returns back an updated customer object.
                // we use the same expansion, so we get back the same fields and can do comparisons.
                CustomerResponse apiResponse = customerApi.UpdateCustomer(customerOid, customer, expand);

                // verify the update
                Console.WriteLine(apiResponse.Customer);

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