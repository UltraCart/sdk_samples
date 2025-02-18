using System;
using System.Reflection;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.coupon
{
    public class DoesCouponCodeExist
    {
        public static void Execute()
        {
            Console.WriteLine("--- " + MethodBase.GetCurrentMethod()?.DeclaringType?.Name + " ---");

            try
            {
                CouponApi couponApi = new CouponApi(Constants.ApiKey);

                String merchantCode = Guid.NewGuid().ToString("N").Substring(0, 8);

                CouponExistsResponse couponExistsResponse = couponApi.DoesCouponCodeExist(merchantCode);
                // The response should be false.
                if (couponExistsResponse.Exists)
                {
                    throw new Exception("CouponApi.DoesCouponCodeExist should have returned false.");
                }

                // Now create the coupon and ensure it exists.
                Coupon coupon = new Coupon();
                coupon.MerchantCode = merchantCode;
                coupon.Description = "Test coupon for DoesCouponCodeExist";
                coupon.AmountOffSubtotal = new CouponAmountOffSubtotal("USD", 0.01m); // one penny discount.

                CouponResponse couponResponse = couponApi.InsertCoupon(coupon);
                coupon = couponResponse.Coupon;

                Console.WriteLine("Created the following temporary coupon:");
                Console.WriteLine($"Coupon OID: {coupon.MerchantCode}");
                Console.WriteLine($"Coupon Type: {coupon.CouponType}");
                Console.WriteLine($"Coupon Description: {coupon.Description}");

                couponExistsResponse = couponApi.DoesCouponCodeExist(merchantCode);
                if (!couponExistsResponse.Exists)
                {
                    throw new Exception(
                        "CouponApi.DoesCouponCodeExist should have returned true after creating the coupon.");
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