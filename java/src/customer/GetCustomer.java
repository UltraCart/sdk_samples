package customer;

import com.ultracart.admin.v2.CustomerApi;
import com.ultracart.admin.v2.models.Customer;
import com.ultracart.admin.v2.models.CustomerResponse;
import common.Constants;

public class GetCustomer {
    /**
     * Of the two GetCustomer methods, you'll probably always use GetCustomerByEmail instead of this one.
     * Most customer logic revolves around the email, not the customer oid. The latter is only meaningful as a primary
     * key in the UltraCart databases. But here is an example of using GetCustomer().
     */
    public static void Execute() {
        try {
            String email = CustomerFunctions.createRandomEmail();
            int customerOid = CustomerFunctions.insertSampleCustomer(email);
            CustomerApi customerApi = new CustomerApi(Constants.API_KEY);

            // the _expand variable is set to return just the address fields.
            // see CustomerFunctions for a list of expansions, or consult the source: https://www.ultracart.com/api/
            CustomerResponse apiResponse = customerApi.getCustomer(customerOid, "billing,shipping");
            Customer customer = apiResponse.getCustomer(); // assuming this succeeded

            System.out.println(customer);

            CustomerFunctions.deleteSampleCustomer(customerOid);
        }
        catch (Exception ex) {
            System.err.println("An Exception occurred. Please review the following error:");
            System.err.println(ex); // <-- change_me: handle gracefully
            System.exit(1);
        }
    }
}