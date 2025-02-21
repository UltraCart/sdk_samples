package customer;

import com.ultracart.admin.v2.CustomerApi;
import com.ultracart.admin.v2.models.CustomerMagicLinkResponse;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

public class GetMagicLink {
    public static void Execute() {
        /*
            getMagicLink returns back a url whereby a merchant can log into their website as the customer.
            This may be useful to "see what the customer is seeing" and is the only method to do so since
            the customer's passwords are encrypted.  Note: A merchant may also do this using the UltraCart
            backend site within the Customer Management section.
         */

        try {
            CustomerApi customerApi = new CustomerApi(Constants.API_KEY);

            // create a customer
            int customerOid = CustomerFunctions.insertSampleCustomer();
            String storefront = "www.website.com";  // required.  many merchants have dozens of storefronts. which one?

            CustomerMagicLinkResponse apiResponse = customerApi.getMagicLink(customerOid, storefront);
            String url = apiResponse.getUrl();

            System.out.println("<html><body><script>window.location.href = " +
                URLEncoder.encode(url, StandardCharsets.UTF_8.toString()) + ";</script></body></html>");

            // clean up this sample. - don't do this or the above magic link won't work.  But you'll want to clean up this
            // sample customer manually using the backend.
            // CustomerFunctions.deleteSampleCustomer(customerOid);

        } catch (ApiException e) {
            System.out.println("An ApiException occurred.  Please review the following error:");
            System.out.println(e); // <-- change_me: handle gracefully
            System.exit(1);
        } catch (UnsupportedEncodingException e) {
          throw new RuntimeException(e);
        }
    }
}