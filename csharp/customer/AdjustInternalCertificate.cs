using System;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.customer
{
    public class AdjustInternalCertificate
    {
        /**
         * Adjusts the cashback balance of a customer. This method's name is adjustInternalCertificate, which
         * is a poor choice of naming, but results from an underlying implementation of using an internal gift certificate
         * to track cashback balance. Sorry for the confusion.
         *
         * This method requires a customer profile oid. This is a unique number used by UltraCart to identify a customer.
         * If you do not know a customer's oid, call getCustomerByEmail() to retrieve the customer and their oid.
         *
         * Possible Errors:
         * Missing adjustment amount -> "adjust_internal_certificate_request.adjustment_amount is required and was missing"
         */
        public static void Execute()
        {
            CustomerApi customerApi = new CustomerApi(Constants.ApiKey);

            string email = "test@ultracart.com";
            Customer customer = customerApi.GetCustomerByEmail(email).Customer;
            int customerOid = customer.CustomerProfileOid;

            AdjustInternalCertificateRequest adjustRequest = new AdjustInternalCertificateRequest();
            adjustRequest.Description = "Adjusting customer cashback balance because they called and complained about product.";
            adjustRequest.ExpirationDays = 365; // expires in 365 days
            adjustRequest.VestingDays = 45; // customer has to wait 45 days to use it.
            adjustRequest.AdjustmentAmount = 59; // add 59 to their balance.
            adjustRequest.OrderId = "DEMO-12345"; // or leave null. this ties the adjustment to a particular order.
            adjustRequest.EntryDts = null; // use current time.

            AdjustInternalCertificateResponse apiResponse = customerApi.AdjustInternalCertificate(customerOid, adjustRequest);

            if (apiResponse.Error != null)
            {
                Console.Error.WriteLine(apiResponse.Error.DeveloperMessage);
                Console.Error.WriteLine(apiResponse.Error.UserMessage);
                Environment.Exit(1);
            }

            Console.WriteLine($"Success: {apiResponse.Success}");
            Console.WriteLine($"Adjustment Amount: {apiResponse.AdjustmentAmount}");
            Console.WriteLine($"Balance Amount: {apiResponse.BalanceAmount}");
            
            Console.WriteLine(apiResponse);
        }
    }
}