package coupon;

import com.ultracart.admin.v2.CouponApi;
import com.ultracart.admin.v2.models.Coupon;
import com.ultracart.admin.v2.models.CouponAmountOffSubtotal;
import com.ultracart.admin.v2.models.CouponExistsResponse;
import com.ultracart.admin.v2.models.CouponResponse;
import common.Constants;

import java.math.BigDecimal;
import java.util.UUID;

public class DoesCouponCodeExist {
    public static void execute() {
        System.out.println("--- " + DoesCouponCodeExist.class.getSimpleName() + " ---");

        try {
            CouponApi couponApi = new CouponApi(Constants.API_KEY);

            String merchantCode = UUID.randomUUID().toString().substring(0, 8);

            CouponExistsResponse couponExistsResponse = couponApi.doesCouponCodeExist(merchantCode);
            // The response should be false.
            if (couponExistsResponse.getExists()) {
                throw new Exception("CouponApi.doesCouponCodeExist should have returned false.");
            }

            // Now create the coupon and ensure it exists.
            Coupon coupon = new Coupon();
            coupon.setMerchantCode(merchantCode);
            coupon.setDescription("Test coupon for DoesCouponCodeExist");
            
            CouponAmountOffSubtotal amountOff = new CouponAmountOffSubtotal();
            amountOff.setCurrencyCode("USD");
            amountOff.setDiscountAmount(new BigDecimal("0.01")); // one penny discount
            coupon.setAmountOffSubtotal(amountOff);

            CouponResponse couponResponse = couponApi.insertCoupon(coupon, null);
            coupon = couponResponse.getCoupon();

            System.out.println("Created the following temporary coupon:");
            System.out.println("Coupon OID: " + coupon.getMerchantCode());
            System.out.println("Coupon Type: " + coupon.getCouponType());
            System.out.println("Coupon Description: " + coupon.getDescription());

            couponExistsResponse = couponApi.doesCouponCodeExist(merchantCode);
            if (!couponExistsResponse.getExists()) {
                throw new Exception(
                    "CouponApi.doesCouponCodeExist should have returned true after creating the coupon.");
            }

            // Delete the coupon
            couponApi.deleteCoupon(coupon.getCouponOid());
        } catch (Exception ex) {
            System.out.println("Error: " + ex.getMessage());
            ex.printStackTrace();
        }
    }
}