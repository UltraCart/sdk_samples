package coupon;

import com.ultracart.admin.v2.CouponApi;
import com.ultracart.admin.v2.models.Coupon;
import com.ultracart.admin.v2.models.CouponAmountOffSubtotal;
import com.ultracart.admin.v2.models.CouponDeletesRequest;
import com.ultracart.admin.v2.models.CouponResponse;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.UUID;

public class DeleteCouponsByOid {
    
    /**
     * Deletes a specific coupon using the UltraCart API
     */
    public static void execute() {
        System.out.println("--- " + DeleteCouponsByOid.class.getSimpleName() + " ---");

        CouponApi couponApi = new CouponApi(Constants.API_KEY);
        String expand = null; // coupons do not have expansions.

        String merchantCode = UUID.randomUUID().toString().substring(0, 8);
        
        Coupon coupon = new Coupon();
        coupon.setMerchantCode(merchantCode); 
        coupon.setDescription("Test coupon for DeleteCouponsByCode");
        
        CouponAmountOffSubtotal amountOff = new CouponAmountOffSubtotal();
        amountOff.setCurrencyCode("USD");
        amountOff.setDiscountAmount(new BigDecimal("0.01")); // one penny discount
        coupon.setAmountOffSubtotal(amountOff);

        try {
            CouponResponse couponResponse = couponApi.insertCoupon(coupon, expand);
            coupon = couponResponse.getCoupon();

            System.out.println("Created the following temporary coupon:");
            System.out.println("Coupon OID: " + coupon.getMerchantCode());
            System.out.println("Coupon Type: " + coupon.getCouponType());
            System.out.println("Coupon Description: " + coupon.getDescription());
            
            // Delete the coupon
            CouponDeletesRequest deleteRequest = new CouponDeletesRequest();
            deleteRequest.setCouponOids(Collections.singletonList(coupon.getCouponOid()));             
            couponApi.deleteCouponsByOid(deleteRequest);

            System.out.println("Successfully deleted coupon with merchantCode: " + merchantCode);
        } catch (ApiException e) {
            System.err.println("Error occurred: " + e.getMessage());
            e.printStackTrace();
        }
    }
}