using System;
using System.Reflection;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.coupon
{
    public class DeleteCoupon
    {
        
        /// <summary>
        /// Deletes a specific coupon using the UltraCart API
        /// </summary>
        public static void Execute()
        {
            Console.WriteLine("--- " + MethodBase.GetCurrentMethod()?.DeclaringType?.Name + " ---");
            
            CouponApi couponApi = new CouponApi(Constants.ApiKey);
            string expand = null; // coupons do not have expansions.
            
            Coupon coupon = new Coupon();
            coupon.MerchantCode = Guid.NewGuid().ToString("N").Substring(0, 8);
            coupon.Description = "Test coupon for sdk_sample.coupon.DeleteCoupon";
            coupon.AmountOffSubtotal = new CouponAmountOffSubtotal("USD", 0.01m); // one penny discount.

            CouponResponse couponResponse = couponApi.InsertCoupon(coupon, expand);
            coupon = couponResponse.Coupon;

            Console.WriteLine("Created the following temporary coupon:");
            Console.WriteLine($"Coupon OID: {coupon.CouponOid}");
            Console.WriteLine($"Coupon Type: {coupon.CouponType}");
            Console.WriteLine($"Coupon Description: {coupon.Description}");
            
            int couponOid = coupon.CouponOid;
            
            // Delete the coupon
            couponApi.DeleteCoupon(couponOid);

            Console.WriteLine($"Successfully deleted coupon with ID: {couponOid}");
        }
    }
}