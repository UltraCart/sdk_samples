using System;
using System.Collections.Generic;
using System.Reflection;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.coupon
{
    public class UpdateAutoApply
    {
        /*
          updateAutoApply updates the items and subtotals conditions that trigger "auto coupons", i.e. coupons that are automatically
          added to a shopping cart.  The manual configuration of auto coupons is at the bottom of the main coupons screen.
          See: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1376525/Coupons#Coupons-Navigation

          // Success is 200 (There is no content.  Yes, this should return a 204, but it returns a 200 with no content)
        */
        public static void Execute()
        {
            Console.WriteLine("--- " + MethodBase.GetCurrentMethod()?.DeclaringType?.Name + " ---");
            
            try
            {
                // Create coupon API instance using API key
                CouponApi couponApi = new CouponApi(Constants.ApiKey);
                
                // Create auto apply conditions
                CouponAutoApplyConditions autoApply = new CouponAutoApplyConditions();
                
                // Create item condition
                CouponAutoApplyCondition itemCondition = new CouponAutoApplyCondition();
                itemCondition.RequiredItemId = "ITEM_ABC";
                itemCondition.CouponCode = "10OFF";
                List<CouponAutoApplyCondition> itemConditions = new List<CouponAutoApplyCondition> { itemCondition };
                
                // Create subtotal condition
                CouponAutoApplyCondition subtotalCondition = new CouponAutoApplyCondition();
                subtotalCondition.MinimumSubtotal = 50; // must spend fifty dollars
                subtotalCondition.CouponCode = "5OFF"; // Corrected from item condition in original code
                List<CouponAutoApplyCondition> subtotalConditions = new List<CouponAutoApplyCondition> { subtotalCondition };
                
                // Set conditions to auto apply object
                autoApply.RequiredItems = itemConditions;
                autoApply.SubtotalLevels = subtotalConditions;
                
                // Update auto apply conditions
                couponApi.UpdateAutoApply(autoApply);
                
                Console.WriteLine("Auto apply conditions updated successfully");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                Console.WriteLine(ex.StackTrace);
            }
        }
    }
}