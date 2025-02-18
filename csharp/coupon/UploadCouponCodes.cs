using System;
using System.Collections.Generic;
using System.Reflection;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.coupon
{
    public class UploadCouponCodes
    {
        /*
          uploadCouponCodes allows a merchant to upload one-time use codes and associate them with a merchant code (i.e. a coupon).
          UltraCart has methods for generating one-time codes, and they work well, but this method exists when the merchant generates
          them themselves. This frequently occurs when a merchant sends out a mailer with unique coupon codes on the mailer. The
          merchant can then upload those codes with this method.
        */
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
                
                // Create request for uploading coupon codes
                UploadCouponCodesRequest codesRequest = new UploadCouponCodesRequest();
                codesRequest.CouponCodes = new List<string> { "code1", "code2", "code3" };
                
                // Upload the coupon codes
                var apiResponse = couponApi.UploadCouponCodes(coupon.CouponOid, codesRequest);
                
                // Display results
                Console.WriteLine("Uploaded codes:");
                foreach (var code in apiResponse.UploadedCodes)
                {
                    Console.WriteLine(code);
                }
                
                Console.WriteLine("Duplicated codes:");
                foreach (var code in apiResponse.DuplicateCodes)
                {
                    Console.WriteLine(code);
                }
                
                Console.WriteLine("Rejected codes:");
                foreach (var code in apiResponse.RejectedCodes)
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