using System;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.customer
{
    public class AddCustomerStoreCredit
    {
        /**
         * Adds store credit to a customer's account.
         *
         * This method requires a customer profile oid. This is a unique number used by UltraCart to identify a customer.
         * If you do not know a customer's oid, call getCustomerByEmail() to retrieve the customer and their oid.
         *
         * Possible Errors:
         * Missing store credit -> "store_credit_request.amount is missing and is required."
         * Zero or negative store credit -> "store_credit_request.amount must be a positive amount."
         */
        public static void Execute()
        {
            CustomerApi customerApi = new CustomerApi(Constants.ApiKey);

            string email = "test@ultracart.com";
            Customer customer = customerApi.GetCustomerByEmail(email).Customer;
            int customerOid = customer.CustomerProfileOid;

            CustomerStoreCreditAddRequest storeCreditRequest = new CustomerStoreCreditAddRequest();
            storeCreditRequest.Amount = 20.00m;
            storeCreditRequest.Description = "Customer is super cool and I wanted to give them store credit.";
            storeCreditRequest.ExpirationDays = 365; // or leave null for no expiration
            storeCreditRequest.VestingDays = 45; // customer has to wait 45 days to use it.

            BaseResponse apiResponse = customerApi.AddCustomerStoreCredit(customerOid, storeCreditRequest);

            if (apiResponse.Error != null)
            {
                Console.Error.WriteLine(apiResponse.Error.DeveloperMessage);
                Console.Error.WriteLine(apiResponse.Error.UserMessage);
                Environment.Exit(1);
            }

            Console.WriteLine(apiResponse.Success);
        }
    }
}