package customer;

import com.ultracart.admin.v2.CustomerApi;
import com.ultracart.admin.v2.models.Customer;
import com.ultracart.admin.v2.models.CustomerQuery;
import com.ultracart.admin.v2.models.CustomersResponse;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

import java.util.ArrayList;
import java.util.List;

public class GetCustomersByQuery {
    /*
     * This example illustrates how to retrieve customers. It uses the pagination logic necessary to query all customers.
     */
    public static void Execute() {
        // pulling all records could take a long time.
        CustomerApi customerApi = new CustomerApi(Constants.API_KEY);

        List<Customer> customers = new ArrayList<>();

        int iteration = 1;
        int offset = 0;
        int limit = 200;
        boolean moreRecordsToFetch = true;

        try {
            while (moreRecordsToFetch) {
                System.out.println("executing iteration " + iteration);

                List<Customer> chunkOfCustomers = getCustomerChunk(customerApi, offset, limit);
                customers.addAll(chunkOfCustomers);
                offset = offset + limit;
                moreRecordsToFetch = chunkOfCustomers.size() == limit;
                iteration++;
            }
        }
        catch (Exception e) {
            System.out.println("Exception occurred on iteration " + iteration);
            System.out.println(e);
            System.exit(1);
        }

        // this will be verbose...
        for (Customer customer : customers) {
            System.out.println(customer);
        }
    }

    /**
     * Retrieves a chunk of customers based on specified parameters
     *
     * @param customerApi The customer API client
     * @param offset Starting position for retrieval
     * @param limit Maximum number of records to retrieve
     * @return List of customers
     */
    private static List<Customer> getCustomerChunk(CustomerApi customerApi, int offset, int limit) throws ApiException {
        // The real devil in the getCustomers calls is the expansion, making sure you return everything you need without
        // returning everything since these objects are extremely large. The customer object can be truly large with
        // all the order history. These are the possible expansion values.
        /*
            attachments     billing     cards           cc_emails       loyalty     orders_summary          pricing_tiers
            privacy         properties  quotes_summary  reviewer        shipping    software_entitlements   tags
            tax_codes
        */
        String expand = "shipping,billing"; // just the address fields. contact us if you're unsure

        // TODO: This is just showing all the possibilities. In reality, you'll just assign the filters you need.
        CustomerQuery query = new CustomerQuery();
        //query.setEmail(null);
        //query.setQbClass(null);
        //query.setQuickbooksCode(null);
        //query.setLastModifiedDtsStart(null);
        //query.setLastModifiedDtsEnd(null);
        //query.setSignupDtsStart(null);
        //query.setSignupDtsEnd(null);
        //query.setBillingFirstName(null);
        //query.setBillingLastName(null);
        //query.setBillingCompany(null);
        //query.setBillingCity(null);
        //query.setBillingState(null);
        //query.setBillingPostalCode(null);
        //query.setBillingCountryCode(null);
        //query.setBillingDayPhone(null);
        //query.setBillingEveningPhone(null);
        //query.setShippingFirstName(null);
        //query.setShippingLastName(null);
        //query.setShippingCompany(null);
        //query.setShippingCity(null);
        //query.setShippingState(null);
        //query.setShippingPostalCode(null);
        //query.setShippingCountryCode(null);
        //query.setShippingDayPhone(null);
        //query.setShippingEveningPhone(null);
        //query.setPricingTierOid(null);
        //query.setPricingTierName(null);

        String since = null;
        String sort = "email";

        CustomersResponse apiResponse = customerApi.getCustomersByQuery(query, offset, limit, since, sort, expand);

        if (apiResponse.getCustomers() != null) {
            return apiResponse.getCustomers();
        }
        return new ArrayList<>();
    }
}