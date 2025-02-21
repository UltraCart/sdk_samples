package checkout;

import java.util.Collections;
import com.ultracart.admin.v2.CheckoutApi;
import com.ultracart.admin.v2.models.*;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

public class SetupBrowserKey {
    public static void execute() {
        /*
            This is a checkout api method. It creates a browser key for use in a client side checkout. This call must be
            made server side with a Simple API Key or an OAuth access_token.
         */

        try {
            CheckoutApi checkoutApi = new CheckoutApi(Constants.API_KEY);

            CheckoutSetupBrowserKeyRequest keyRequest = new CheckoutSetupBrowserKeyRequest();
            keyRequest.setAllowedReferrers(Collections.singletonList("https://www.mywebsite.com"));
            String browserKey = checkoutApi.setupBrowserKey(keyRequest).getBrowserKey();

            System.out.println("<html lang=\"en\"><body><pre>");
            System.out.println(browserKey);
            System.out.println("</pre></body></html>");
        } catch (ApiException e) {
            e.printStackTrace();
        }
    }
}