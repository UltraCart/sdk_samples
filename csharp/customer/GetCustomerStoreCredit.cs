using System;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.customer
{
    public class GetCustomerStoreCredit
    {
        /*
            getCustomerStoreCredit returns back the store credit for a customer, which includes:
            total - lifetime credit
            available - currently available store credit
            vesting - amount of store credit vesting
            expiring - amount of store credit expiring within 30 days
            pastLedgers - transaction history
            futureLedgers - future transactions including expiring entries
         */
        public static void Execute()
        {
            try
            {
                CustomerApi customerApi = new CustomerApi(Constants.ApiKey);

                // create a customer
                int customerOid = CustomerFunctions.InsertSampleCustomer();

                // add some store credit.
                CustomerStoreCreditAddRequest addRequest = new CustomerStoreCreditAddRequest();
                addRequest.Description = "First credit add";
                addRequest.VestingDays = 10;
                addRequest.ExpirationDays = 20; // that's not a lot of time!
                addRequest.Amount = 20;
                customerApi.AddCustomerStoreCredit(customerOid, addRequest);

                // add more store credit.
                addRequest = new CustomerStoreCreditAddRequest();
                addRequest.Description = "Second credit add";
                addRequest.VestingDays = 0; // immediately available.
                addRequest.ExpirationDays = 90;
                addRequest.Amount = 40;
                customerApi.AddCustomerStoreCredit(customerOid, addRequest);

                CustomerStoreCreditResponse apiResponse = customerApi.GetCustomerStoreCredit(customerOid);
                CustomerStoreCredit storeCredit = apiResponse.CustomerStoreCredit;

                Console.WriteLine(storeCredit); // <-- There's a lot of information inside this object.

                // clean up this sample.
                CustomerFunctions.DeleteSampleCustomer(customerOid);
            }
            catch (Exception e)
            {
                Console.WriteLine("An Exception occurred. Please review the following error:");
                Console.WriteLine(e); // <-- change_me: handle gracefully
                Environment.Exit(1);
            }
        }
    }
}