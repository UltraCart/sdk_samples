using System;
using System.Collections.Generic;
using System.Reflection;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.coupon
{
    public class GetCoupons
    {
        public static void Execute()
        {
            Console.WriteLine("--- " + MethodBase.GetCurrentMethod()?.DeclaringType?.Name + " ---");
            
            try
            {
                List<Coupon> coupons = new List<Coupon>();
                
                int iteration = 1;
                int offset = 0;
                int limit = 200;
                bool needMoreRecords = true;
                
                while (needMoreRecords)
                {
                    Console.WriteLine($"executing iteration #{iteration++}");
                    List<Coupon> blockOfCoupons = GetCouponsChunk(offset, limit);
                    foreach (Coupon coupon in blockOfCoupons)
                    {
                        coupons.Add(coupon);
                    }
                    
                    offset += limit;
                    needMoreRecords = blockOfCoupons.Count == limit;
                    // Thread.Sleep(1000);  // I'm testing rate limiter headers. this should probably be uncommented. maybe.
                }
                
                // Display the coupons
                foreach (var coupon in coupons)
                {
                    Console.WriteLine(coupon);
                }
                
                Console.WriteLine($"Total coupons retrieved: {coupons.Count}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                Console.WriteLine(ex.StackTrace);
            }
        }
        
        /// <summary>
        /// Returns a block of coupons
        /// </summary>
        /// <param name="offset">pagination variable</param>
        /// <param name="limit">pagination variable. max server will allow is 200</param>
        /// <returns>List of Coupon objects</returns>
        public static List<Coupon> GetCouponsChunk(int offset = 0, int limit = 200)
        {
            // Create coupon API instance using API key
            CouponApi couponApi = new CouponApi(Constants.ApiKey);
            
            // TODO: consider using GetCouponsByQuery() as it does not require all search parameters
            string merchantCode = null;
            string description = null;
            string couponType = null;
            string startDateBegin = null;
            string startDateEnd = null;
            string expirationDateBegin = null;
            string expirationDateEnd = null;
            int? affiliateOid = null;
            bool? excludeExpired = null;
            
            string sort = null;
            string expand = null; // getCoupons doesn't have any expansions. full record is always returned.
            
            var getResponse = couponApi.GetCoupons(merchantCode, description, couponType, 
                startDateBegin, startDateEnd, expirationDateBegin, expirationDateEnd, 
                affiliateOid, excludeExpired, limit, offset, sort, expand);
                
            if (getResponse.Success && getResponse.Success)
            {
                return getResponse.Coupons;
            }
            
            return new List<Coupon>();
        }
    }
}