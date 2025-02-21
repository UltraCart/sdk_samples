package customer;

import com.ultracart.admin.v2.CustomerApi;
import com.ultracart.admin.v2.models.CustomerStoreCredit;
import com.ultracart.admin.v2.models.CustomerStoreCreditAddRequest;
import com.ultracart.admin.v2.models.CustomerStoreCreditResponse;
import common.Constants;

import java.math.BigDecimal;

public class GetCustomerStoreCredit {
    /*
        getCustomerStoreCredit returns back the store credit for a customer, which includes:
        total - lifetime credit
        available - currently available store credit
        vesting - amount of store credit vesting
        expiring - amount of store credit expiring within 30 days
        pastLedgers - transaction history
        futureLedgers - future transactions including expiring entries
     */
    public static void Execute() {
        try {
            CustomerApi customerApi = new CustomerApi(Constants.API_KEY);

            // create a customer
            int customerOid = CustomerFunctions.insertSampleCustomer();

            // add some store credit.
            CustomerStoreCreditAddRequest addRequest = new CustomerStoreCreditAddRequest();
            addRequest.setDescription("First credit add");
            addRequest.setVestingDays(10);
            addRequest.setExpirationDays(20); // that's not a lot of time!
            addRequest.setAmount(BigDecimal.valueOf(20));
            customerApi.addCustomerStoreCredit(customerOid, addRequest);

            // add more store credit.
            addRequest = new CustomerStoreCreditAddRequest();
            addRequest.setDescription("Second credit add");
            addRequest.setVestingDays(0); // immediately available.
            addRequest.setExpirationDays(90);
            addRequest.setAmount(BigDecimal.valueOf(40));
            customerApi.addCustomerStoreCredit(customerOid, addRequest);

            CustomerStoreCreditResponse apiResponse = customerApi.getCustomerStoreCredit(customerOid);
            CustomerStoreCredit storeCredit = apiResponse.getCustomerStoreCredit();

            System.out.println(storeCredit); // <-- There's a lot of information inside this object.

            // clean up this sample.
            CustomerFunctions.deleteSampleCustomer(customerOid);
        }
        catch (Exception e) {
            System.out.println("An Exception occurred. Please review the following error:");
            System.out.println(e); // <-- change_me: handle gracefully
            System.exit(1);
        }
    }
}