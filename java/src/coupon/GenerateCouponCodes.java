package coupon;

import com.ultracart.admin.v2.CouponApi;
import com.ultracart.admin.v2.models.*;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

public class GenerateCouponCodes {
    public static void execute() {
        System.out.println("--- " + GenerateCouponCodes.class.getSimpleName() + " ---");
        
        try {
            // Create coupon API instance using API key
            CouponApi couponApi = new CouponApi(Constants.API_KEY);

            String merchantCode = UUID.randomUUID().toString().substring(0, 8);
                
            // Now create the coupon and ensure it exists.
            Coupon coupon = new Coupon();
            coupon.setMerchantCode(merchantCode);
            coupon.setDescription("Test coupon for GetCoupon");
            
            CouponAmountOffSubtotal amountOff = new CouponAmountOffSubtotal();
            amountOff.setCurrencyCode("USD");
            amountOff.setDiscountAmount(new BigDecimal("0.01")); // one penny discount
            coupon.setAmountOffSubtotal(amountOff);

            CouponResponse couponResponse = couponApi.insertCoupon(coupon, null);
            coupon = couponResponse.getCoupon();
                
            CouponCodesRequest codesRequest = new CouponCodesRequest();
            codesRequest.setQuantity(5); // give me 5 codes.
            codesRequest.setExpirationDts(Instant.now().plus(90, ChronoUnit.DAYS).toString()); // do you want the codes to expire?
            // codesRequest.setExpirationSeconds(null); // also an option for short-lived coupons
                
            CouponCodesResponse apiResponse = couponApi.generateCouponCodes(coupon.getCouponOid(), codesRequest);
            List<String> couponCodes = apiResponse.getCouponCodes();
                
            // Display generated coupon codes
            System.out.println("Generated " + couponCodes.size() + " coupon codes:");
            for (String code : couponCodes) {
                System.out.println(code);
            }
                
            // Delete the coupon
            couponApi.deleteCoupon(coupon.getCouponOid());
                
        } catch (ApiException ex) {
            System.out.println("Error: " + ex.getMessage());
            ex.printStackTrace();
        }
    }
}