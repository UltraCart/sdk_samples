package coupon;

import com.ultracart.admin.v2.CouponApi;
import com.ultracart.admin.v2.models.Coupon;
import com.ultracart.admin.v2.models.CouponsResponse;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

import java.util.ArrayList;
import java.util.List;

public class GetCoupons {
    public static void execute() {
        try {
            List<Coupon> coupons = new ArrayList<>();
            
            int iteration = 1;
            int offset = 0;
            int limit = 200;
            boolean needMoreRecords = true;
            
            while (needMoreRecords) {
                System.out.println("executing iteration #" + iteration++);
                List<Coupon> blockOfCoupons = getCouponsChunk(offset, limit);
                coupons.addAll(blockOfCoupons);
                
                offset += limit;
                needMoreRecords = blockOfCoupons.size() == limit;
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
     * Returns a block of coupons
     * 
     * @param offset pagination variable
     * @param limit pagination variable. max server will allow is 200
     * @return List of Coupon objects
     */
    public static List<Coupon> getCouponsChunk(int offset, int limit) throws ApiException {
        // Create coupon API instance using API key
        CouponApi couponApi = new CouponApi(Constants.API_KEY);
        
        // TODO: consider using getCouponsByQuery() as it does not require all search parameters
        String merchantCode = null;
        String description = null;
        String couponType = null;
        String startDateBegin = null;
        String startDateEnd = null;
        String expirationDateBegin = null;
        String expirationDateEnd = null;
        Integer affiliateOid = null;
        Boolean excludeExpired = null;
        
        String sort = null;
        String expand = null; // getCoupons doesn't have any expansions. full record is always returned.
        
        CouponsResponse getResponse = couponApi.getCoupons(
            merchantCode, description, couponType, 
            startDateBegin, startDateEnd, 
            expirationDateBegin, expirationDateEnd, 
            affiliateOid, excludeExpired, 
            limit, offset, sort, expand
        );
            
        return getResponse.getCoupons() != null ? getResponse.getCoupons() : new ArrayList<>();
    }
}