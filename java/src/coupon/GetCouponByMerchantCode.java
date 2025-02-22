package coupon;

import com.ultracart.admin.v2.CouponApi;
import com.ultracart.admin.v2.models.Coupon;
import com.ultracart.admin.v2.models.CouponAmountOffSubtotal;
import com.ultracart.admin.v2.models.CouponResponse;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

import java.math.BigDecimal;
import java.util.UUID;

public class GetCouponByMerchantCode {
    public static void execute() {
        try {
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

            System.out.println("Created the following temporary coupon:");
            System.out.println("Coupon OID: " + coupon.getMerchantCode());
            System.out.println("Coupon Type: " + coupon.getCouponType());
            System.out.println("Coupon Description: " + coupon.getDescription());

            couponResponse = couponApi.getCouponByMerchantCode(merchantCode, null);
            Coupon copyOfCoupon = couponResponse.getCoupon();
            System.out.println("GetCoupon returned the following coupon:");
            System.out.println("Coupon OID: " + copyOfCoupon.getMerchantCode());
            System.out.println("Coupon Type: " + copyOfCoupon.getCouponType());
            System.out.println("Coupon Description: " + copyOfCoupon.getDescription());
            
            // Delete the coupon
            couponApi.deleteCoupon(coupon.getCouponOid());
        }
        catch (ApiException ex) {
            System.out.println("Error: " + ex.getMessage());
            ex.printStackTrace();
        }
    }
}