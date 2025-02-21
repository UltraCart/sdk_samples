package customer;

import com.ultracart.admin.v2.CustomerApi;
import com.ultracart.admin.v2.models.BaseResponse;
import com.ultracart.admin.v2.models.Customer;
import com.ultracart.admin.v2.models.CustomerStoreCreditAddRequest;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

import java.math.BigDecimal;

public class AddCustomerStoreCredit {
    /**
     * Adds store credit to a customer's account.
     *
     * This method requires a customer profile oid. This is a unique number used by UltraCart to identify a customer.
     * If you do not know a customer's oid, call getCustomerByEmail() to retrieve the customer and their oid.
     *
     * Possible Errors:
     * Missing store credit -> "store_credit_request.amount is missing and is required."
     * Zero or negative store credit -> "store_credit_request.amount must be a positive amount."
     */
    public static void execute() {
        CustomerApi customerApi = new CustomerApi(Constants.API_KEY);

        try {
            String email = "test@ultracart.com";
            Customer customer = customerApi.getCustomerByEmail(email, null).getCustomer();
            int customerOid = customer.getCustomerProfileOid();

            CustomerStoreCreditAddRequest storeCreditRequest = new CustomerStoreCreditAddRequest();
            storeCreditRequest.setAmount(BigDecimal.valueOf(20.00));
            storeCreditRequest.setDescription("Customer is super cool and I wanted to give them store credit.");
            storeCreditRequest.setExpirationDays(365); // or leave null for no expiration
            storeCreditRequest.setVestingDays(45); // customer has to wait 45 days to use it.

            BaseResponse apiResponse = customerApi.addCustomerStoreCredit(customerOid, storeCreditRequest);

            if (apiResponse.getError() != null) {
                System.err.println(apiResponse.getError().getDeveloperMessage());
                System.err.println(apiResponse.getError().getUserMessage());
                System.exit(1);
            }

            System.out.println(apiResponse.getSuccess());

        } catch (ApiException e) {
            System.err.println("API Exception: " + e.getMessage());
            e.printStackTrace();
        }
    }
}