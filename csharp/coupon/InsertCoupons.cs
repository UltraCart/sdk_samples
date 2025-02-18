using System;
using System.Collections.Generic;
using System.Reflection;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.coupon
{
    public class InsertCoupons
    {
        public static void Execute()
        {
            Console.WriteLine("--- " + MethodBase.GetCurrentMethod()?.DeclaringType?.Name + " ---");
            try
            {
                // Create coupon API instance using API key
                CouponApi couponApi = new CouponApi(Constants.ApiKey);
                
                Coupon coupon1 = new Coupon();
                coupon1.MerchantCode = "PennyOff";
                coupon1.Description ="Test Coupon for InsertCoupons sample";
                coupon1.AmountOffSubtotal = new CouponAmountOffSubtotal(); // see InsertCoupon for examples of types
                coupon1.AmountOffSubtotal.DiscountAmount = 0.01m;

                Coupon coupon2 = new Coupon();
                coupon2.MerchantCode = "TwoPenniesOff";
                coupon2.Description ="Test Coupon for InsertCoupons sample";
                coupon2.AmountOffSubtotal = new CouponAmountOffSubtotal(); // see InsertCoupon for examples of types
                coupon2.AmountOffSubtotal.DiscountAmount = 0.02m;
                
                CouponsRequest couponsRequest = new CouponsRequest();
                couponsRequest.Coupons = new List<Coupon> { coupon1, coupon2 };
                var apiResponse = couponApi.InsertCoupons(couponsRequest);
                
                Console.WriteLine(apiResponse);

                foreach (Coupon coupon in apiResponse.Coupons)
                {
                    Console.WriteLine($"Deleting newly created coupon (Coupon OID {coupon.CouponOid}) to clean up.");
                    couponApi.DeleteCoupon(coupon.CouponOid);
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