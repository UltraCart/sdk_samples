package customer;

import com.ultracart.admin.v2.CustomerApi;
import com.ultracart.admin.v2.models.Customer;
import com.ultracart.admin.v2.models.CustomerBilling;
import com.ultracart.admin.v2.models.CustomerResponse;
import com.ultracart.admin.v2.models.CustomerShipping;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.List;

public class CustomerFunctions {
    private static final String CHARS = "ABCDEFGH";
    private static final SecureRandom random = new SecureRandom();

    /**
     * Creates a random email for test purposes
     *
     * @return A random email address
     */
    public static String createRandomEmail() {
        char[] stringChars = new char[CHARS.length()];

        for (int i = 0; i < stringChars.length; i++) {
            stringChars[i] = CHARS.charAt(random.nextInt(CHARS.length()));
        }

        String rand = new String(stringChars);
        return "sample_" + rand + ".test.com";
    }

    /**
     * Inserts a sample customer into the system
     *
     * @param email Optional email address. If null, a random one will be generated
     * @return The new created customer's CustomerProfileOid
     */
    public static int insertSampleCustomer(String email) throws ApiException {
        char[] stringChars = new char[CHARS.length()];

        for (int i = 0; i < stringChars.length; i++) {
            stringChars[i] = CHARS.charAt(random.nextInt(CHARS.length()));
        }

        String rand = new String(stringChars);

        if (email == null) {
            email = "sample_" + rand + ".test.com";
        }

        System.out.println("InsertSampleCustomer will attempt to create customer " + email);
        CustomerApi customerApi = new CustomerApi(Constants.API_KEY);

        Customer newCustomer = new Customer();
        newCustomer.setEmail(email);

        CustomerBilling billing = new CustomerBilling();
        billing.setFirstName("First" + rand);
        billing.setLastName("Last" + rand);
        billing.setCompany("Company" + rand);
        billing.setCountryCode("US");
        billing.setStateRegion("GA");
        billing.setCity("Duluth");
        billing.setPostalCode("30097");
        billing.setAddress1("11960 Johns Creek Parkway");
        List<CustomerBilling> billingList = new ArrayList<>();
        billingList.add(billing);
        newCustomer.setBilling(billingList);

        CustomerShipping shipping = new CustomerShipping();
        shipping.setFirstName("First" + rand);
        shipping.setLastName("Last" + rand);
        shipping.setCompany("Company" + rand);
        shipping.setCountryCode("US");
        shipping.setStateRegion("GA");
        shipping.setCity("Duluth");
        shipping.setPostalCode("30097");
        shipping.setAddress1("11960 Johns Creek Parkway");
        List<CustomerShipping> shippingList = new ArrayList<>();
        shippingList.add(shipping);
        newCustomer.setShipping(shippingList);

        String expand = "billing,shipping"; // I want to see the address fields returned on the newly created object.
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

        System.out.println("InsertCustomer request object follows:");
        System.out.println(newCustomer);

        CustomerResponse apiResponse = customerApi.insertCustomer(newCustomer, expand);

        System.out.println("InsertCustomer response object follows:");
        System.out.println(apiResponse);

        return apiResponse.getCustomer().getCustomerProfileOid();
    }

    /**
     * Overloaded method to allow calling without an email (generating a random one)
     */
    public static int insertSampleCustomer() throws ApiException {
        return insertSampleCustomer(null);
    }

    /**
     * If you don't know the customer oid, call GetCustomerByEmail first to retrieve
     * the customer, grab the oid, and use it.
     *
     * @param customerOid Customer oid of the customer to be deleted
     */
    public static void deleteSampleCustomer(int customerOid) throws ApiException {
        CustomerApi customerApi = new CustomerApi(Constants.API_KEY);

        System.out.println("calling DeleteCustomer(" + customerOid + ")");
        customerApi.deleteCustomer(customerOid);
    }
}