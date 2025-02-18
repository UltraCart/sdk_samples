using System;
using System.Collections.Generic;
using System.Reflection;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.coupon
{
    public class DeleteCouponsByOid
    {
        
        /// <summary>
        /// Deletes a specific coupon using the UltraCart API
        /// </summary>
        public static void Execute()
        {
            Console.WriteLine("--- " + MethodBase.GetCurrentMethod()?.DeclaringType?.Name + " ---");

            CouponApi couponApi = new CouponApi(Constants.ApiKey);
            string expand = null; // coupons do not have expansions.

            String merchantCode = Guid.NewGuid().ToString("N").Substring(0, 8);
            
            Coupon coupon = new Coupon();
            coupon.MerchantCode = merchantCode; 
            coupon.Description = "Test coupon for DeleteCouponsByCode";
            coupon.AmountOffSubtotal = new CouponAmountOffSubtotal("USD", 0.01m); // one penny discount.

            CouponResponse couponResponse = couponApi.InsertCoupon(coupon, expand);
            coupon = couponResponse.Coupon;

            Console.WriteLine("Created the following temporary coupon:");
            Console.WriteLine($"Coupon OID: {coupon.MerchantCode}");
            Console.WriteLine($"Coupon Type: {coupon.CouponType}");
            Console.WriteLine($"Coupon Description: {coupon.Description}");
            
            // Delete the coupon
            CouponDeletesRequest deleteRequest = new CouponDeletesRequest();
            deleteRequest.CouponOids = new List<int> { coupon.CouponOid };             
            couponApi.DeleteCouponsByCode(deleteRequest);

            Console.WriteLine($"Successfully deleted coupon with merchantCode: {merchantCode}");
        }
    }
}