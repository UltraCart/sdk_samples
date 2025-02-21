package customer;

import com.ultracart.admin.v2.CustomerApi;
import com.ultracart.admin.v2.models.Customer;
import com.ultracart.admin.v2.models.CustomerResponse;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

public class UpdateCustomer {
    public static void execute() {
        try {
            int customerOid = CustomerFunctions.insertSampleCustomer();

            CustomerApi customerApi = new CustomerApi(Constants.API_KEY);
            // just want address fields.  see https://www.ultracart.com/api/#resource_customer.html for all expansion values
            String expand = "billing,shipping";
            Customer customer = customerApi.getCustomer(customerOid, expand).getCustomer();
            
            // TODO: do some edits to the customer.  Here we will change some billing fields.
            customer.getBilling().get(0).address2("Apartment 101");

            // notice expand is passed to update as well since it returns back an updated customer object.
            // we use the same expansion, so we get back the same fields and can do comparisons.
            CustomerResponse apiResponse = customerApi.updateCustomer(customerOid, customer, expand);

            // verify the update
            System.out.println(apiResponse.getCustomer());

            CustomerFunctions.deleteSampleCustomer(customerOid);
        } catch (ApiException e) {
            System.err.println("An ApiException occurred. Please review the following error:");
            e.printStackTrace();
            System.exit(1);
        }
    }
}