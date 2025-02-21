package customer;

import com.ultracart.admin.v2.util.ApiException;

public class InsertCustomer {
    public static void execute() {
        try {
            int customerOid = CustomerFunctions.insertSampleCustomer();
            CustomerFunctions.deleteSampleCustomer(customerOid);
        } catch (ApiException e) {
            System.err.println("An ApiException occurred. Please review the following error:");
            e.printStackTrace();
            System.exit(1);
        }
    }
}