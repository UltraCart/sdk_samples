package customer;

import com.ultracart.admin.v2.CustomerApi;
import com.ultracart.admin.v2.models.Customer;
import com.ultracart.admin.v2.models.CustomersResponse;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

import java.util.ArrayList;
import java.util.List;

public class GetCustomers {
    /**
     * This example illustrates how to retrieve customers. It uses the pagination logic necessary to query all customers.
     * This method was the first GetCustomers and has parameters for all the search terms. It's an ogre. Using
     * GetCustomersByQuery is much easier to use.
     */
    public static List<Customer> getCustomerChunk(CustomerApi customerApi, int offset, int limit) throws ApiException {
        // The real devil in the GetCustomers calls is the expansion, making sure you return everything you need without
        // returning everything since these objects are extremely large. The customer object can be truly large with
        // all the order history. These are the possible expansion values.
        /*
            attachments     billing     cards           cc_emails       loyalty     orders_summary          pricing_tiers
            privacy         properties  quotes_summary  reviewer        shipping    software_entitlements   tags
            tax_codes     
         */
        String expand = "shipping,billing"; // just the address fields. contact us if you're unsure
        
        // TODO: Seriously, use GetCustomersByQuery -- it's so much better than this old method.
        String email = null;
        String qbClass = null;
        String quickbooksCode = null;
        String lastModifiedDtsStart = null;
        String lastModifiedDtsEnd = null;
        String signupDtsStart = null;
        String signupDtsEnd = null;
        String billingFirstName = null;
        String billingLastName = null;
        String billingCompany = null;
        String billingCity = null;
        String billingState = null;
        String billingPostalCode = null;
        String billingCountryCode = null;
        String billingDayPhone = null;
        String billingEveningPhone = null;
        String shippingFirstName = null;
        String shippingLastName = null;
        String shippingCompany = null;
        String shippingCity = null;
        String shippingState = null;
        String shippingPostalCode = null;
        String shippingCountryCode = null;
        String shippingDayPhone = null;
        String shippingEveningPhone = null;
        Integer pricingTierOid = null;
        String pricingTierName = null;
        String since = null;
        String sort = null;
        
        CustomersResponse apiResponse = customerApi.getCustomers(
            email, qbClass, quickbooksCode, lastModifiedDtsStart, lastModifiedDtsEnd, signupDtsStart, signupDtsEnd,
            billingFirstName, billingLastName, billingCompany, billingCity, billingState, billingPostalCode,
            billingCountryCode, billingDayPhone, billingEveningPhone, shippingFirstName, shippingLastName,
            shippingCompany, shippingCity, shippingState, shippingPostalCode, shippingCountryCode,
            shippingDayPhone, shippingEveningPhone, pricingTierOid, pricingTierName, limit, offset, since, sort, expand);

        if (apiResponse.getCustomers() != null) {
            return apiResponse.getCustomers();
        }
        return new ArrayList<>();
    }

    public static void Execute() {
        try {
            CustomerApi customerApi = new CustomerApi(Constants.API_KEY);
            List<Customer> customers = new ArrayList<>();

            int iteration = 1;
            int offset = 0;
            int limit = 200;
            boolean moreRecordsToFetch = true;

            while (moreRecordsToFetch) {
                System.out.println("Executing iteration " + iteration);

                List<Customer> chunkOfCustomers = getCustomerChunk(customerApi, offset, limit);
                customers.addAll(chunkOfCustomers);
                offset = offset + limit;
                moreRecordsToFetch = chunkOfCustomers.size() == limit;
                iteration++;
            }

            // This will be verbose...
            System.out.println(customers);
        }
        catch (Exception ex) {
            System.err.println("Exception occurred: " + ex.getMessage());
            System.err.println(ex);
            System.exit(1);
        }
    }
}