package customer;

import com.ultracart.admin.v2.CustomerApi;
import com.ultracart.admin.v2.models.CustomerMergeRequest;
import com.ultracart.admin.v2.util.ApiException;

import common.Constants;

public class MergeCustomer {
    public static void Execute() {
        /*
            The merge function was requested by UltraCart merchants that sell software and manage activation keys.  Frequently,
            customers would purchase their software using one email address, and then accidentally re-subscribe using a
            different email address (for example, they purchased subsequent years using PayPal which was tied to their spouse's
            email).  However it happened, the customer now how software licenses spread across multiple emails and therefore
            multiple customer profiles.

            merge combine the customer profiles, merging order history and software entitlements.  Still, it may be used to
            combine any two customer profiles for any reason.

            Success returns back a status code 204 (No Content)
         */

        try {
            // first customer
            int firstCustomerOid = CustomerFunctions.insertSampleCustomer();

            String secondEmail = CustomerFunctions.createRandomEmail();
            int secondCustomerOid = CustomerFunctions.insertSampleCustomer(secondEmail);

            CustomerMergeRequest mergeRequest = new CustomerMergeRequest();
            // Supply either the email or the customer oid.  Only need one.
            mergeRequest.setEmail(secondEmail);
            // mergeRequest.setCustomerProfileOid(customerOid);

            CustomerApi customerApi = new CustomerApi(Constants.API_KEY);
            customerApi.mergeCustomer(firstCustomerOid, mergeRequest, null);

            // clean up this sample.
            CustomerFunctions.deleteSampleCustomer(firstCustomerOid);
            // Notice: No need to delete the second sample.  The merge call deletes it.
        }
        catch (ApiException e) {
            System.out.println("An ApiException occurred.  Please review the following error:");
            System.out.println(e); // <-- change_me: handle gracefully
            System.exit(1);
        }
    }
}