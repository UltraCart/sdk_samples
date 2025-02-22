package coupon;

import com.ultracart.admin.v2.CouponApi;
import com.ultracart.admin.v2.models.Coupon;
import com.ultracart.admin.v2.models.CouponAmountOffSubtotal;
import com.ultracart.admin.v2.models.CouponsRequest;
import com.ultracart.admin.v2.models.CouponsResponse;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class InsertCoupons {
    public static void Execute() {
        System.out.println("--- " + InsertCoupons.class.getSimpleName() + " ---");
        try {
            // Create coupon API instance using API key
            CouponApi couponApi = new CouponApi(Constants.API_KEY);
            
            Coupon coupon1 = new Coupon();
            coupon1.setMerchantCode("PennyOff");
            coupon1.setDescription("Test Coupon for InsertCoupons sample");
            coupon1.setAmountOffSubtotal(new CouponAmountOffSubtotal()); // see InsertCoupon for examples of types
            coupon1.getAmountOffSubtotal().setDiscountAmount(new BigDecimal("0.01"));

            Coupon coupon2 = new Coupon();
            coupon2.setMerchantCode("TwoPenniesOff");
            coupon2.setDescription("Test Coupon for InsertCoupons sample");
            coupon2.setAmountOffSubtotal(new CouponAmountOffSubtotal()); // see InsertCoupon for examples of types
            coupon2.getAmountOffSubtotal().setDiscountAmount(new BigDecimal("0.02"));
            
            CouponsRequest couponsRequest = new CouponsRequest();
            List<Coupon> couponList = new ArrayList<>();
            couponList.add(coupon1);
            couponList.add(coupon2);
            couponsRequest.setCoupons(couponList);

            CouponsResponse apiResponse = couponApi.insertCoupons(couponsRequest, null, false);
            
            System.out.println(apiResponse);

            for (Coupon coupon : apiResponse.getCoupons()) {
                System.out.println("Deleting newly created coupon (Coupon OID " + coupon.getCouponOid() + ") to clean up.");
                couponApi.deleteCoupon(coupon.getCouponOid());
            }
        }
        catch (ApiException ex) {
            System.out.println("Error: " + ex.getMessage());
            ex.printStackTrace();
        }
    }
}