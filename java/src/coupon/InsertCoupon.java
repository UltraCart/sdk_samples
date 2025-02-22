package coupon;

import com.ultracart.admin.v2.CouponApi;
import com.ultracart.admin.v2.models.Coupon;
import com.ultracart.admin.v2.models.CouponAmountOffSubtotal;
import com.ultracart.admin.v2.models.CouponResponse;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

import java.math.BigDecimal;

public class InsertCoupon {
    public static void execute() {
        try {
            // Create coupon API instance using API key
            CouponApi couponApi = new CouponApi(Constants.API_KEY);

            // Create a new coupon
            Coupon coupon = new Coupon();
            coupon.setMerchantCode("InsertCouponSample");
            coupon.setDescription("One penny off subtotal");

            // Each coupon must have a 'type' defined by creating a child object directly beneath the main Coupon object.
            // This is complex and there are a LOT of coupon types. See the backend (secure.ultracart.com) coupon screens
            // to get an idea of what functionality each coupon possesses. If you're not sure, contact UltraCart support.
            coupon.setAmountOffSubtotal(new CouponAmountOffSubtotal()); // one penny discount.
            coupon.getAmountOffSubtotal().setDiscountAmount(BigDecimal.valueOf(.01));
            coupon.getAmountOffSubtotal().setCurrencyCode("USD");

            // Commented out list of coupon types from original code...

            String expand = null; // coupons do not have expansions
            CouponResponse apiResponse = couponApi.insertCoupon(coupon, expand);
            
            coupon = apiResponse.getCoupon();
            System.out.println("Created the following temporary coupon:");
            System.out.println("Coupon OID: " + coupon.getCouponOid());
            System.out.println("Coupon Type: " + coupon.getCouponType());
            System.out.println("Coupon Description: " + coupon.getDescription());
            
            System.out.println("Deleting newly created coupon to clean up.");
            couponApi.deleteCoupon(coupon.getCouponOid());
        }
        catch (ApiException ex) {
            System.out.println("Error: " + ex.getMessage());
            ex.printStackTrace();
        }
    }
}