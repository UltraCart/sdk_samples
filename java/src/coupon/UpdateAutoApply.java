package coupon;

import java.math.BigDecimal;
import java.util.List;
import java.util.ArrayList;

import com.ultracart.admin.v2.CouponApi;
import com.ultracart.admin.v2.models.CouponAutoApplyConditions;
import com.ultracart.admin.v2.models.CouponAutoApplyCondition;
import com.ultracart.admin.v2.util.ApiException;

import common.Constants;

public class UpdateAutoApply {
    /*
      updateAutoApply updates the items and subtotals conditions that trigger "auto coupons", i.e. coupons that are automatically
      added to a shopping cart.  The manual configuration of auto coupons is at the bottom of the main coupons screen.
      See: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1376525/Coupons#Coupons-Navigation

      // Success is 200 (There is no content.  Yes, this should return a 204, but it returns a 200 with no content)
    */
    public static void Execute() {
        System.out.println("--- " + UpdateAutoApply.class.getSimpleName() + " ---");
        
        try {
            // Create coupon API instance using API key
            CouponApi couponApi = new CouponApi(Constants.API_KEY);
            
            // Create auto apply conditions
            CouponAutoApplyConditions autoApply = new CouponAutoApplyConditions();
            
            // Create item condition
            CouponAutoApplyCondition itemCondition = new CouponAutoApplyCondition();
            itemCondition.setRequiredItemId("ITEM_ABC");
            itemCondition.setCouponCode("10OFF");
            List<CouponAutoApplyCondition> itemConditions = new ArrayList<>();
            itemConditions.add(itemCondition);
            
            // Create subtotal condition
            CouponAutoApplyCondition subtotalCondition = new CouponAutoApplyCondition();
            subtotalCondition.setMinimumSubtotal(new BigDecimal("50")); // must spend fifty dollars
            subtotalCondition.setCouponCode("5OFF");
            List<CouponAutoApplyCondition> subtotalConditions = new ArrayList<>();
            subtotalConditions.add(subtotalCondition);
            
            // Set conditions to auto apply object
            autoApply.setRequiredItems(itemConditions);
            autoApply.setSubtotalLevels(subtotalConditions);
            
            // Update auto apply conditions
            couponApi.updateAutoApply(autoApply);
            
            System.out.println("Auto apply conditions updated successfully");
        }
        catch (ApiException ex) {
            System.out.println("Error: " + ex.getMessage());
            ex.printStackTrace();
        }
    }
}