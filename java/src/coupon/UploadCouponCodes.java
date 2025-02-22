package coupon;

import com.ultracart.admin.v2.CouponApi;
import com.ultracart.admin.v2.models.*;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class UploadCouponCodes {
    /*
      uploadCouponCodes allows a merchant to upload one-time use codes and associate them with a merchant code (i.e. a coupon).
      UltraCart has methods for generating one-time codes, and they work well, but this method exists when the merchant generates
      them themselves. This frequently occurs when a merchant sends out a mailer with unique coupon codes on the mailer. The
      merchant can then upload those codes with this method.
    */
    public static void Execute() {
        System.out.println("--- " + UploadCouponCodes.class.getSimpleName() + " ---");
        
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
            
            // Create request for uploading coupon codes
            UploadCouponCodesRequest codesRequest = new UploadCouponCodesRequest();
            List<String> codes = new ArrayList<>();
            codes.add("code1");
            codes.add("code2");
            codes.add("code3");
            codesRequest.setCouponCodes(codes);
            
            // Upload the coupon codes
            UploadCouponCodesResponse apiResponse = couponApi.uploadCouponCodes(coupon.getCouponOid(), codesRequest);
            
            // Display results
            System.out.println("Uploaded codes:");
            for (String code : apiResponse.getUploadedCodes()) {
                System.out.println(code);
            }
            
            System.out.println("Duplicated codes:");
            for (String code : apiResponse.getDuplicateCodes()) {
                System.out.println(code);
            }
            
            System.out.println("Rejected codes:");
            for (String code : apiResponse.getRejectedCodes()) {
                System.out.println(code);
            }
            
            // Delete the coupon
            couponApi.deleteCoupon(coupon.getCouponOid());
            
        }
        catch (ApiException ex) {
            System.out.println("Error: " + ex.getMessage());
            ex.printStackTrace();
        }
    }
}