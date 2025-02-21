package customer;

import com.ultracart.admin.v2.util.ApiException;

public class DeleteCustomer {
    public static void execute() {
        try {
            int customerOid = CustomerFunctions.insertSampleCustomer();
            CustomerFunctions.deleteSampleCustomer(customerOid);
        } catch (ApiException ex) {
            System.err.println("An Exception occurred. Please review the following error:");
            System.err.println(ex);
            System.exit(1);
        }
    }
}