package coupon;

import com.ultracart.admin.v2.CouponApi;
import com.ultracart.admin.v2.models.Coupon;
import com.ultracart.admin.v2.models.CouponQuery;
import com.ultracart.admin.v2.models.CouponsResponse;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

import java.util.ArrayList;
import java.util.List;

public class GetCouponsByQuery {
    /*
    retrieves coupons by query.  Can filter on specific coupons or return back all coupons.  Support pagination.
    A note about the coupon type below.  Those are string literals representing coupons.  This method is used UltraCart's
    backend, and it uses a dropdown box for that value showing friendly descriptions of them.

    It's not anticipated a merchant would need to query by coupon type, but in the event you do, here's the list of constants:
    (Full list of coupon type constants from original C# comment)
    */
    public static void execute() {
        try {
            List<Coupon> coupons = new ArrayList<>();
            
            int iteration = 1;
            int offset = 0;
            int limit = 200;
            boolean moreRecordsToFetch = true;
            
            while (moreRecordsToFetch) {
                System.out.println("executing iteration " + iteration);
                List<Coupon> chunkOfCoupons = getCouponChunk(offset, limit);
                coupons.addAll(chunkOfCoupons);
                offset += limit;
                moreRecordsToFetch = chunkOfCoupons.size() == limit;
                iteration++;
            }
            
            // Display the coupons
            for (Coupon coupon : coupons) {
                System.out.println(coupon);
            }
            
            System.out.println("Total coupons retrieved: " + coupons.size());
        }
        catch (ApiException ex) {
            System.out.println("Error: " + ex.getMessage());
            ex.printStackTrace();
        }
    }
    
    /**
     * Returns a chunk of coupons based on query parameters
     * 
     * @param offset Pagination offset
     * @param limit Maximum number of records to return
     * @return List of matching coupons
     */
    public static List<Coupon> getCouponChunk(int offset, int limit) throws ApiException {
        // Create coupon API instance using API key
        CouponApi couponApi = new CouponApi(Constants.API_KEY);
        
        CouponQuery query = new CouponQuery();
        query.setMerchantCode("10OFF"); // supports partial matching
        query.setDescription("Saturday"); // supports partial matching
        // query.setCouponType(null); // see the note at the top of this sample.
        // query.setStartDtsBegin(Instant.now().minus(2000, ChronoUnit.DAYS).toString()); // yes, that 2,000 days.
        // query.setStartDtsEnd(Instant.now().toString());
        // query.setExpirationDtsBegin(null);
        // query.setExpirationDtsEnd(null);
        // query.setAffiliateOid(0); // this requires an affiliate_oid. If you need help finding an affiliate's oid, contact support.
        query.setExcludeExpired(true);
        
        String expand = null; // coupons do not have expansions
        String sort = "merchant_code"; // Possible sorts: "coupon_type", "merchant_code", "description", "start_dts", "expiration_dts", "quickbooks_code"
        
        CouponsResponse apiResponse = couponApi.getCouponsByQuery(query, limit, offset, sort, expand);
        return apiResponse.getCoupons() != null ? apiResponse.getCoupons() : new ArrayList<>();
    }
}