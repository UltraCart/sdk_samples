package item;

import com.ultracart.admin.v2.ItemApi;
import com.ultracart.admin.v2.models.*;
import common.Constants;

public class GetPricingTiers {
    /// <summary>
    /// Execute method containing all business logic
    /// </summary>
    public static void execute() {
        ItemApi itemApi = new ItemApi(Constants.API_KEY);

        try {
            /*
             * Possible expansion values for PricingTier object:
             * approval_notification
             * signup_notification
             */

            String expand = "approval_notification,signup_notification";
            PricingTiersResponse apiResponse = itemApi.getPricingTiers(expand);

            // Display pricing tiers
            for (PricingTier pricingTier : apiResponse.getPricingTiers()) {
                System.out.println(pricingTier);
            }

        } catch (Exception e) {
            System.out.println("Exception occurred.");
            System.out.println(e);
            System.exit(1);
        }
    }
}