using System;
using System.Reflection;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.coupon
{
    public class GenerateCouponCodes
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
                
                
                CouponCodesRequest codesRequest = new CouponCodesRequest();
                codesRequest.Quantity = 5; // give me 5 codes.
                codesRequest.ExpirationDts = DateTime.UtcNow.AddDays(90).ToString("yyyy-MM-ddTHH:mm:ssK"); // do you want the codes to expire?
                // codesRequest.ExpirationSeconds = null; // also an option for short-lived coupons
                
                var apiResponse = couponApi.GenerateCouponCodes(coupon.CouponOid, codesRequest);
                var couponCodes = apiResponse.CouponCodes;
                
                // Display generated coupon codes
                Console.WriteLine($"Generated {couponCodes.Count} coupon codes:");
                foreach (var code in couponCodes)
                {
                    Console.WriteLine(code);
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