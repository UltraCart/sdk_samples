package coupon;

import com.ultracart.admin.v2.CouponApi;
import com.ultracart.admin.v2.models.Coupon;
import com.ultracart.admin.v2.models.CouponAmountOffSubtotal;
import com.ultracart.admin.v2.models.CouponResponse;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

public class UpdateCoupon {
    public static void Execute() {
        System.out.println("--- " + UpdateCoupon.class.getSimpleName() + " ---");
        
        try {
            // Create coupon API instance using API key
            CouponApi couponApi = new CouponApi(Constants.API_KEY);

            String merchantCode = UUID.randomUUID().toString().replaceAll("-", "").substring(0, 8);
            
            // Now create the coupon and ensure it exists.
            Coupon coupon = new Coupon();
            coupon.setMerchantCode(merchantCode);
            coupon.setDescription("Test coupon for GetCoupon");
            coupon.setAmountOffSubtotal(new CouponAmountOffSubtotal()); // one penny discount.
            coupon.getAmountOffSubtotal().setDiscountAmount(BigDecimal.valueOf(.01));
            coupon.getAmountOffSubtotal().setCurrencyCode("USD");


            CouponResponse couponResponse = couponApi.insertCoupon(coupon, null);
            coupon = couponResponse.getCoupon();
            
            // update the coupon. this can be difficult given the complexity of coupons. see insertCoupon sample for details.
            coupon.setExpirationDts(Instant.now().plus(90, ChronoUnit.DAYS).toString());

            CouponResponse updatedResponse = couponApi.updateCoupon(coupon.getCouponOid(), coupon, null);
            Coupon updatedCoupon = updatedResponse.getCoupon();

            // Display the updated coupon
            System.out.println(updatedCoupon);
        }
        catch (ApiException ex) {
            System.out.println("Error: " + ex.getMessage());
            ex.printStackTrace();
        }
    }
}