using System;
using System.Collections.Generic;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.customer
{
    public class CustomerFunctions
    {
        /// <summary>
        /// Creates a random email for test purposes
        /// </summary>
        /// <returns>A random email address</returns>
        public static string CreateRandomEmail()
        {
            Random random = new Random();
            string chars = "ABCDEFGH";
            char[] stringChars = new char[chars.Length];
            
            for (int i = 0; i < stringChars.Length; i++)
            {
                stringChars[i] = chars[random.Next(chars.Length)];
            }
            
            string rand = new string(stringChars);
            return $"sample_{rand}.test.com";
        }

        /// <summary>
        /// Inserts a sample customer into the system
        /// </summary>
        /// <param name="email">Optional email address. If null, a random one will be generated</param>
        /// <returns>The new created customer's CustomerProfileOid</returns>
        public static int InsertSampleCustomer(string email = null)
        {
            Random random = new Random();
            string chars = "ABCDEFGH";
            char[] stringChars = new char[chars.Length];
            
            for (int i = 0; i < stringChars.Length; i++)
            {
                stringChars[i] = chars[random.Next(chars.Length)];
            }
            
            string rand = new string(stringChars);
            
            if (email == null)
            {
                email = $"sample_{rand}.test.com";
            }
            
            Console.WriteLine($"InsertSampleCustomer will attempt to create customer {email}");
            CustomerApi customerApi = Samples.GetCustomerApi();

            Customer newCustomer = new Customer();
            newCustomer.Email = email;
            
            CustomerBilling billing = new CustomerBilling();
            billing.FirstName = $"First{rand}";
            billing.LastName = $"Last{rand}";
            billing.Company = $"Company{rand}";
            billing.CountryCode = "US";
            billing.StateRegion = "GA";
            billing.City = "Duluth";
            billing.PostalCode = "30097";
            billing.Address1 = "11960 Johns Creek Parkway";
            newCustomer.Billing = new List<CustomerBilling> { billing };

            CustomerShipping shipping = new CustomerShipping();
            shipping.FirstName = $"First{rand}";
            shipping.LastName = $"Last{rand}";
            shipping.Company = $"Company{rand}";
            shipping.CountryCode = "US";
            shipping.StateRegion = "GA";
            shipping.City = "Duluth";
            shipping.PostalCode = "30097";
            shipping.Address1 = "11960 Johns Creek Parkway";
            newCustomer.Shipping = new List<CustomerShipping> { shipping };

            string expand = "billing,shipping"; // I want to see the address fields returned on the newly created object.
            /*  Possible Expansion variables:
                attachments
                billing
                cards
                cc_emails
                loyalty
                orders_summary
                pricing_tiers
                privacy
                properties
                quotes_summary
                reviewer
                shipping
                software_entitlements
                tags
                tax_codes
             */

            Console.WriteLine("InsertCustomer request object follows:");
            Console.WriteLine(newCustomer);
            
            CustomerResponse apiResponse = customerApi.InsertCustomer(newCustomer, expand);
            
            Console.WriteLine("InsertCustomer response object follows:");
            Console.WriteLine(apiResponse);

            return apiResponse.Customer.CustomerProfileOid;
        }

        /// <summary>
        /// If you don't know the customer oid, call GetCustomerByEmail first to retrieve
        /// the customer, grab the oid, and use it.
        /// </summary>
        /// <param name="customerOid">Customer oid of the customer to be deleted</param>
        public static void DeleteSampleCustomer(int customerOid)
        {
            CustomerApi customerApi = Samples.GetCustomerApi();

            Console.WriteLine($"calling DeleteCustomer({customerOid})");
            customerApi.DeleteCustomer(customerOid);
        }
    }
}