using System;
using System.Collections.Generic;
using System.Reflection;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.coupon
{
    public class UpdateCoupons
    {
        public static void Execute()
        {
            Console.WriteLine("--- " + MethodBase.GetCurrentMethod()?.DeclaringType?.Name + " ---");
            
            try
            {
                // Create coupon API instance using API key
                CouponApi couponApi = new CouponApi(Constants.ApiKey);

                String merchantCode = Guid.NewGuid().ToString("N").Substring(0, 8);
                
                // Now create the coupon and ensure it exists.
                Coupon coupon = new Coupon();
                coupon.MerchantCode = merchantCode;
                coupon.Description = "Test coupon for GetCoupon";
                coupon.AmountOffSubtotal = new CouponAmountOffSubtotal("USD", 0.01m); // one penny discount.

                CouponResponse couponResponse = couponApi.InsertCoupon(coupon);
                coupon = couponResponse.Coupon;
                
                // update the coupon. this can be difficult given the complexity of coupons. see insertCoupon sample for details.
                coupon.ExpirationDts = DateTime.UtcNow.AddDays(90).ToString("yyyy-MM-ddTHH:mm:ssK");

                // This example only has one coupon. But it's a trivial matter to add more coupons
                CouponsRequest couponsRequest = new CouponsRequest();
                couponsRequest.Coupons = new List<Coupon> { coupon };

                var updatedResponse = couponApi.UpdateCoupons(couponsRequest);
                List<Coupon> updatedCoupons = updatedResponse.Coupons;

                // Display the updated coupons
                foreach (var updatedCoupon in updatedCoupons)
                {
                    Console.WriteLine(updatedCoupon);
                }
                
                // Delete the coupon
                couponApi.DeleteCoupon(coupon.CouponOid);

            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                Console.WriteLine(ex.StackTrace);
            }
        }
    }
}