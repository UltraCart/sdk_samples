package checkout;

import com.ultracart.admin.v2.CheckoutApi;
import com.ultracart.admin.v2.models.RegisterAffiliateClickRequest;
import com.ultracart.admin.v2.models.RegisterAffiliateClickResponse;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

public class RegisterAffiliateClick {
    public static void execute() {
        // Reference Implementation: https://github.com/UltraCart/responsive_checkout
        // Records an affiliate click.

        CheckoutApi checkoutApi = new CheckoutApi(Constants.API_KEY);

        RegisterAffiliateClickRequest clickRequest = new RegisterAffiliateClickRequest();
        
        // Note: In Java, you'll need to get these values from your HttpContext
        // This is a simplified example - implement proper request handling in your application
        String ipAddress = "127.0.0.1"; // Replace with actual implementation to get IP
        String userAgent = ""; // Replace with actual implementation to get user agent
        String refererUrl = ""; // Replace with actual implementation to get referer URL
        
        clickRequest.setIpAddress(ipAddress);
        clickRequest.setUserAgent(userAgent);
        clickRequest.setReferrerUrl(refererUrl);
        clickRequest.setAffid(123456789); // you should know this from your UltraCart affiliate system.
        clickRequest.setSubid("TODO:SupplyThisValue");
        // clickRequest.setLandingPageUrl(null);  // if you have landing page url.

        try {
            RegisterAffiliateClickResponse apiResponse = checkoutApi.registerAffiliateClick(clickRequest, null);
            System.out.println(apiResponse.toString());
        } catch (ApiException e) {
            e.printStackTrace();
        }
    }
}