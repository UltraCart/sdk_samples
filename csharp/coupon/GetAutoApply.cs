using System;
using System.Reflection;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.coupon
{
    public class GetAutoApply
    {
        /*
          getAutoApply returns back the items and subtotals that trigger "auto coupons", i.e. coupons that are automatically
          added to a shopping cart.  The manual configuration of auto coupons is at the bottom of the main coupons screen.
          See: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1376525/Coupons#Coupons-Navigation
        */
        public static void Execute()
        {
            Console.WriteLine("--- " + MethodBase.GetCurrentMethod()?.DeclaringType?.Name + " ---");
            
            try
            {
                // Create coupon API instance using API key
                CouponApi couponApi = new CouponApi(Constants.ApiKey);
                
                // Get auto apply coupons information
                var apiResponse = couponApi.GetAutoApply();
                
                // Display subtotal levels
                Console.WriteLine("These are the subtotal levels:");
                foreach (var subtotalLevel in apiResponse.SubtotalLevels)
                {
                    Console.WriteLine(subtotalLevel);
                }
                
                // Display item triggers
                Console.WriteLine("These are the item triggers:");
                foreach (var requiredItem in apiResponse.RequiredItems)
                {
                    Console.WriteLine(requiredItem);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                Console.WriteLine(ex.StackTrace);
            }
        }
    }
}