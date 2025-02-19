using System;
using System.Collections.Generic;
using System.Linq;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.customer
{
    public class GetCustomersByQuery
    {
        /*
         * This example illustrates how to retrieve customers. It uses the pagination logic necessary to query all customers.
         */
        public static void Execute()
        {
            // pulling all records could take a long time.
            CustomerApi customerApi = Samples.GetCustomerApi();

            List<Customer> customers = new List<Customer>();

            int iteration = 1;
            int offset = 0;
            int limit = 200;
            bool moreRecordsToFetch = true;

            try
            {
                while (moreRecordsToFetch)
                {
                    Console.WriteLine("executing iteration " + iteration);

                    List<Customer> chunkOfCustomers = GetCustomerChunk(customerApi, offset, limit);
                    customers = customers.Concat(chunkOfCustomers).ToList();
                    offset = offset + limit;
                    moreRecordsToFetch = chunkOfCustomers.Count == limit;
                    iteration++;
                }
            }
            catch (Exception e)
            {
                Console.WriteLine("Exception occurred on iteration " + iteration);
                Console.WriteLine(e);
                Environment.Exit(1);
            }

            // this will be verbose...
            foreach (Customer customer in customers)
            {
                Console.WriteLine(customer);
            }
        }

        /// <summary>
        /// Retrieves a chunk of customers based on specified parameters
        /// </summary>
        /// <param name="customerApi">The customer API client</param>
        /// <param name="offset">Starting position for retrieval</param>
        /// <param name="limit">Maximum number of records to retrieve</param>
        /// <returns>List of customers</returns>
        private static List<Customer> GetCustomerChunk(CustomerApi customerApi, int offset, int limit)
        {
            // The real devil in the getCustomers calls is the expansion, making sure you return everything you need without
            // returning everything since these objects are extremely large. The customer object can be truly large with
            // all the order history. These are the possible expansion values.
            /*
                attachments     billing     cards           cc_emails       loyalty     orders_summary          pricing_tiers
                privacy         properties  quotes_summary  reviewer        shipping    software_entitlements   tags
                tax_codes
            */
            string expand = "shipping,billing"; // just the address fields. contact us if you're unsure

            // TODO: This is just showing all the possibilities. In reality, you'll just assign the filters you need.
            CustomerQuery query = new CustomerQuery();
            //query.Email = null;
            //query.QbClass = null;
            //query.QuickbooksCode = null;
            //query.LastModifiedDtsStart = null;
            //query.LastModifiedDtsEnd = null;
            //query.SignupDtsStart = null;
            //query.SignupDtsEnd = null;
            //query.BillingFirstName = null;
            //query.BillingLastName = null;
            //query.BillingCompany = null;
            //query.BillingCity = null;
            //query.BillingState = null;
            //query.BillingPostalCode = null;
            //query.BillingCountryCode = null;
            //query.BillingDayPhone = null;
            //query.BillingEveningPhone = null;
            //query.ShippingFirstName = null;
            //query.ShippingLastName = null;
            //query.ShippingCompany = null;
            //query.ShippingCity = null;
            //query.ShippingState = null;
            //query.ShippingPostalCode = null;
            //query.ShippingCountryCode = null;
            //query.ShippingDayPhone = null;
            //query.ShippingEveningPhone = null;
            //query.PricingTierOid = null;
            //query.PricingTierName = null;

            string since = null;
            string sort = "email";

            CustomersResponse apiResponse = customerApi.GetCustomersByQuery(query, offset, limit, since, sort, expand);

            if (apiResponse.Customers != null)
            {
                return apiResponse.Customers;
            }
            return new List<Customer>();
        }
    }
}