using System;
using System.Collections.Generic;
using System.Reflection;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.coupon
{
    public class GetCouponsByQuery
    {
        /*
        retrieves coupons by query.  Can filter on specific coupons or return back all coupons.  Support pagination.
        A note about the coupon type below.  Those are string literals representing coupons.  This method is used UltraCart's
        backend, and it uses a dropdown box for that value showing friendly descriptions of them.

        It's not anticipated a merchant would need to query by coupon type, but in the event you do, here's the list of constants:
        "BOGO limit L"
        "Free shipping method Y"
        "Free shipping method Y with purchase of items Z"
        "Free shipping method Y with subtotal Z"
        "Free shipping on item Z"
        "Free X with purchase of Y dollars limit L"
        "Free X with purchase of Y dollars limit L and shipping Z"
        "Free X with purchase of Y limit L"
        "Free X with purchase of Y limit L and free shipping"
        "I Free X with every J purchase of Y limit L"
        "I Free X with every J purchase of Y mix and match group limit L"
        "Item X for Y with purchase of Z limit L"
        "multiple X $ off item Z limit L"
        "No discount"
        "Tiered Dollar Off Subtotal"
        "Tiered % off items Z limit L"
        "Tiered $ off item Z limit L"
        "Tiered Percent off shipping methods Y with subtotal Z"
        "Tiered Percent Off Subtotal"
        "X dollars off shipping method Y with purchase of items Z"
        "X dollars off subtotal with purchase Y items"
        "X $ for item Z limit L"
        "X more loyalty cashback"
        "X more loyalty points"
        "X % off item Z and free shipping"
        "X $ off item Z limit L"
        "X % off item Z limit L"
        "X % off msrp item Z limit L"
        "X % off retail item Z limit L"
        "X $ off shipping method Y"
        "X % off shipping method Y"
        "X $ off subtotal"
        "X % off subtotal"
        "X $ off subtotal and shipping"
        "X % off subtotal free shipping method Y"
        "X % off subtotal limit L"
        "X off subtotal with purchase block of L item Y"
        "X % off subtotal with purchase of item Y"
        "X % off subtotal with purchase of Y"
        "X $ off subtotal with Y $ purchase"
        "X $ off subtotal with Y $ purchase and free shipping"
        "X % off Y with purchase Z limit L"
        "X % off Y with T purchase Z limit L"
        "X percent more loyalty points"
        "X $ shipping method Y with subtotal Z"
        "X ? subtotal"
        */
        public static void Execute()
        {
            Console.WriteLine("--- " + MethodBase.GetCurrentMethod()?.DeclaringType?.Name + " ---");
            
            try
            {
                List<Coupon> coupons = new List<Coupon>();
                
                int iteration = 1;
                int offset = 0;
                int limit = 200;
                bool moreRecordsToFetch = true;
                
                while (moreRecordsToFetch)
                {
                    Console.WriteLine($"executing iteration {iteration}");
                    List<Coupon> chunkOfCoupons = GetCouponChunk(offset, limit);
                    coupons.AddRange(chunkOfCoupons);
                    offset += limit;
                    moreRecordsToFetch = chunkOfCoupons.Count == limit;
                    iteration++;
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
        /// Returns a chunk of coupons based on query parameters
        /// </summary>
        /// <param name="offset">Pagination offset</param>
        /// <param name="limit">Maximum number of records to return</param>
        /// <returns>List of matching coupons</returns>
        public static List<Coupon> GetCouponChunk(int offset, int limit)
        {
            // Create coupon API instance using API key
            CouponApi couponApi = new CouponApi(Constants.ApiKey);
            
            CouponQuery query = new CouponQuery();
            query.MerchantCode = "10OFF"; // supports partial matching
            query.Description = "Saturday"; // supports partial matching
            // query.CouponType = null; // see the note at the top of this sample.
            // query.StartDtsBegin = DateTime.UtcNow.AddDays(-2000).ToString("yyyy-MM-ddTHH:mm:ssK"); // yes, that 2,000 days.
            // query.StartDtsEnd = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ssK");
            // query.ExpirationDtsBegin = null;
            // query.ExpirationDtsEnd = null;
            // query.AffiliateOid = 0; // this requires an affiliate_oid. If you need help finding an affiliate's oid, contact support.
            query.ExcludeExpired = true;
            
            string expand = null; // coupons do not have expansions
            string sort = "merchant_code"; // Possible sorts: "coupon_type", "merchant_code", "description", "start_dts", "expiration_dts", "quickbooks_code"
            
            var apiResponse = couponApi.GetCouponsByQuery(query, limit, offset, sort, expand);
            if (apiResponse.Coupons != null)
            {
                return apiResponse.Coupons;
            }
            return new List<Coupon>();
        }
    }
}