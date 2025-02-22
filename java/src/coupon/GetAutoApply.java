package coupon;

import com.ultracart.admin.v2.CouponApi;
import com.ultracart.admin.v2.models.CouponAutoApplyConditions;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

public class GetAutoApply {
    /*
      getAutoApply returns back the items and subtotals that trigger "auto coupons", i.e. coupons that are automatically
      added to a shopping cart.  The manual configuration of auto coupons is at the bottom of the main coupons screen.
      See: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1376525/Coupons#Coupons-Navigation
    */
    public static void execute() {
        try {
            // Create coupon API instance using API key
            CouponApi couponApi = new CouponApi(Constants.API_KEY);
            
            // Get auto apply coupons information
            CouponAutoApplyConditions apiResponse = couponApi.getAutoApply();
            
            // Display subtotal levels
            System.out.println("These are the subtotal levels:");
            for (Object subtotalLevel : apiResponse.getSubtotalLevels()) {
                System.out.println(subtotalLevel);
            }
            
            // Display item triggers
            System.out.println("These are the item triggers:");
            for (Object requiredItem : apiResponse.getRequiredItems()) {
                System.out.println(requiredItem);
            }
        }
        catch (ApiException ex) {
            System.out.println("Error: " + ex.getMessage());
            ex.printStackTrace();
        }
    }
}