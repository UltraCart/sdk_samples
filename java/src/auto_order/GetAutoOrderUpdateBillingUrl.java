package auto_order;

import com.ultracart.admin.v2.AutoOrderApi;
import com.ultracart.admin.v2.models.*;
import common.Constants;

public class GetAutoOrderUpdateBillingUrl {
    /**
     * retrieves the url a customer can use to update the billing information on an auto order, given the auto_order_oid.
     * This is the same url sent in the auto order update billing email.
     * Requires the auto_order_write scope because the url carries a customer access token.
     */
    public static void execute() {
        System.out.println("--- " + GetAutoOrderUpdateBillingUrl.class.getSimpleName() + " ---");

        try {
            // Create auto order API instance using API key
            AutoOrderApi autoOrderApi = new AutoOrderApi(Constants.API_KEY);

            int autoOrderOid = 123456789; // If you don't know the oid, use getAutoOrdersByQuery for retrieving auto orders

            OrderAutoOrderUpdateBillingUrlResponse apiResponse = autoOrderApi.getAutoOrderUpdateBillingUrl(autoOrderOid);

            // WARNING: this url grants access to the customer's billing information.  Do not log it or expose it
            // publicly in production.  It is printed here only for demonstration.
            System.out.println(apiResponse.getUpdateBillingUrl());
        } catch (Exception ex) {
            System.out.println("Error: " + ex.getMessage());
            ex.printStackTrace();
        }
    }
}
