using System;
using System.Reflection;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.coupon
{
    public class GetCouponByMerchantCode
    {
        public static void Execute()
        {
            Console.WriteLine("--- " + MethodBase.GetCurrentMethod()?.DeclaringType?.Name + " ---");

            try
            {
                CouponApi couponApi = new CouponApi(Constants.ApiKey);

                String merchantCode = Guid.NewGuid().ToString("N").Substring(0, 8);
                
                // Now create the coupon and ensure it exists.
                Coupon coupon = new Coupon();
                coupon.MerchantCode = merchantCode;
                coupon.Description = "Test coupon for GetCoupon";
                coupon.AmountOffSubtotal = new CouponAmountOffSubtotal("USD", 0.01m); // one penny discount.

                CouponResponse couponResponse = couponApi.InsertCoupon(coupon);
                coupon = couponResponse.Coupon;

                Console.WriteLine("Created the following temporary coupon:");
                Console.WriteLine($"Coupon OID: {coupon.MerchantCode}");
                Console.WriteLine($"Coupon Type: {coupon.CouponType}");
                Console.WriteLine($"Coupon Description: {coupon.Description}");

                couponResponse = couponApi.GetCouponByMerchantCode(merchantCode);
                Coupon copyOfCoupon = couponResponse.Coupon;
                Console.WriteLine("GetCoupon returned the following coupon:");
                Console.WriteLine($"Coupon OID: {copyOfCoupon.MerchantCode}");
                Console.WriteLine($"Coupon Type: {copyOfCoupon.CouponType}");
                Console.WriteLine($"Coupon Description: {copyOfCoupon.Description}");
                
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