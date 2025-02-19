using System;
using System.Collections.Generic;
using System.Linq;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.customer
{
    public class GetCustomers
    {
        /**
         * This example illustrates how to retrieve customers. It uses the pagination logic necessary to query all customers.
         * This method was the first GetCustomers and has parameters for all the search terms. It's an ogre. Using
         * GetCustomersByQuery is much easier to use.
         */
        public static List<Customer> GetCustomerChunk(CustomerApi customerApi, int offset, int limit)
        {
            // The real devil in the GetCustomers calls is the expansion, making sure you return everything you need without
            // returning everything since these objects are extremely large. The customer object can be truly large with
            // all the order history. These are the possible expansion values.
            /*
                attachments     billing     cards           cc_emails       loyalty     orders_summary          pricing_tiers
                privacy         properties  quotes_summary  reviewer        shipping    software_entitlements   tags
                tax_codes     
             */
            string expand = "shipping,billing"; // just the address fields. contact us if you're unsure
            
            // TODO: Seriously, use GetCustomersByQuery -- it's so much better than this old method.
            string email = null;
            string qbClass = null;
            string quickbooksCode = null;
            string lastModifiedDtsStart = null;
            string lastModifiedDtsEnd = null;
            string signupDtsStart = null;
            string signupDtsEnd = null;
            string billingFirstName = null;
            string billingLastName = null;
            string billingCompany = null;
            string billingCity = null;
            string billingState = null;
            string billingPostalCode = null;
            string billingCountryCode = null;
            string billingDayPhone = null;
            string billingEveningPhone = null;
            string shippingFirstName = null;
            string shippingLastName = null;
            string shippingCompany = null;
            string shippingCity = null;
            string shippingState = null;
            string shippingPostalCode = null;
            string shippingCountryCode = null;
            string shippingDayPhone = null;
            string shippingEveningPhone = null;
            int? pricingTierOid = null;
            string pricingTierName = null;
            string since = null;
            string sort = null;
            
            CustomersResponse apiResponse = customerApi.GetCustomers(
                email, qbClass, quickbooksCode, lastModifiedDtsStart, lastModifiedDtsEnd, signupDtsStart, signupDtsEnd,
                billingFirstName, billingLastName, billingCompany, billingCity, billingState, billingPostalCode,
                billingCountryCode, billingDayPhone, billingEveningPhone, shippingFirstName, shippingLastName,
                shippingCompany, shippingCity, shippingState, shippingPostalCode, shippingCountryCode,
                shippingDayPhone, shippingEveningPhone, pricingTierOid, pricingTierName, limit, offset, since, sort, expand);

            if (apiResponse.Customers != null)
            {
                return apiResponse.Customers.ToList();
            }
            return new List<Customer>();
        }

        public static void Execute()
        {
            try
            {
                CustomerApi customerApi = Samples.GetCustomerApi();
                List<Customer> customers = new List<Customer>();

                int iteration = 1;
                int offset = 0;
                int limit = 200;
                bool moreRecordsToFetch = true;

                while (moreRecordsToFetch)
                {
                    Console.WriteLine($"Executing iteration {iteration}");

                    List<Customer> chunkOfCustomers = GetCustomerChunk(customerApi, offset, limit);
                    customers.AddRange(chunkOfCustomers);
                    offset = offset + limit;
                    moreRecordsToFetch = chunkOfCustomers.Count == limit;
                    iteration++;
                }

                // This will be verbose...
                Console.WriteLine(customers);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Exception occurred: {ex.Message}");
                Console.Error.WriteLine(ex);
                Environment.Exit(1);
            }
        }
    }
}