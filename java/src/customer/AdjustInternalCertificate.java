package customer;

import com.ultracart.admin.v2.CustomerApi;
import com.ultracart.admin.v2.models.AdjustInternalCertificateRequest;
import com.ultracart.admin.v2.models.AdjustInternalCertificateResponse;
import com.ultracart.admin.v2.models.Customer;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

import java.math.BigDecimal;

public class AdjustInternalCertificate {
    /**
     * Adjusts the cashback balance of a customer. This method's name is adjustInternalCertificate, which
     * is a poor choice of naming, but results from an underlying implementation of using an internal gift certificate
     * to track cashback balance. Sorry for the confusion.
     *
     * This method requires a customer profile oid. This is a unique number used by UltraCart to identify a customer.
     * If you do not know a customer's oid, call getCustomerByEmail() to retrieve the customer and their oid.
     *
     * Possible Errors:
     * Missing adjustment amount -> "adjust_internal_certificate_request.adjustment_amount is required and was missing"
     */
    public static void execute() {
        CustomerApi customerApi = new CustomerApi(Constants.API_KEY);

        try {
            String email = "test@ultracart.com";
            Customer customer = customerApi.getCustomerByEmail(email, null).getCustomer();
            int customerOid = customer.getCustomerProfileOid();

            AdjustInternalCertificateRequest adjustRequest = new AdjustInternalCertificateRequest();
            adjustRequest.setDescription("Adjusting customer cashback balance because they called and complained about product.");
            adjustRequest.setExpirationDays(365); // expires in 365 days
            adjustRequest.setVestingDays(45); // customer has to wait 45 days to use it.
            adjustRequest.setAdjustmentAmount(new BigDecimal("59")); // add 59 to their balance.
            adjustRequest.setOrderId("DEMO-12345"); // or leave null. this ties the adjustment to a particular order.
            adjustRequest.setEntryDts(null); // use current time.

            AdjustInternalCertificateResponse apiResponse = customerApi.adjustInternalCertificate(customerOid, adjustRequest);

            if (apiResponse.getError() != null) {
                System.err.println(apiResponse.getError().getDeveloperMessage());
                System.err.println(apiResponse.getError().getUserMessage());
                System.exit(1);
            }

            System.out.println("Success: " + apiResponse.getSuccess());
            System.out.println("Adjustment Amount: " + apiResponse.getAdjustmentAmount());
            System.out.println("Balance Amount: " + apiResponse.getBalanceAmount());

            System.out.println(apiResponse);

        } catch (ApiException e) {
            System.err.println("API Exception: " + e.getMessage());
            e.printStackTrace();
        }
    }
}