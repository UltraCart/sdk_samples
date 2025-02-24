// Import API and UltraCart types
import { couponApi } from '../api';
import { Coupon, CouponAmountOffSubtotal, UploadCouponCodesRequest } from 'ultracart_rest_api_v2_typescript';

// Namespace-like structure using a class
export class UploadCouponCodes {
  /*
   * uploadCouponCodes allows a merchant to upload one-time use codes and associate them with a merchant code (i.e. a coupon).
   * UltraCart has methods for generating one-time codes, and they work well, but this method exists when the merchant generates
   * them themselves. This frequently occurs when a merchant sends out a mailer with unique coupon codes on the mailer. The
   * merchant can then upload those codes with this method.
   */
  public static async execute(): Promise<void> {
    console.log(`--- UploadCouponCodes ---`);

    try {
      // Generate a random 8-character merchant code (replacing GUID)
      const merchantCode = Math.random().toString(36).substring(2, 10);

      // Create the coupon and ensure it exists
      const coupon: Coupon = {
        merchant_code: merchantCode,
        description: "Test coupon for GetCoupon",
        amount_off_subtotal: {
          currency: "USD",
          discount_amount: 0.01, // one penny discount, decimal becomes number
        } as CouponAmountOffSubtotal,
      };

      // Insert the coupon
      const couponResponse = await couponApi.insertCoupon({
        coupon: coupon,
      });
      const createdCoupon = couponResponse.coupon;

      if (!createdCoupon?.coupon_oid) {
        throw new Error("Failed to create coupon; no OID returned");
      }

      // Create request for uploading coupon codes
      const codesRequest: UploadCouponCodesRequest = {
        coupon_codes: ["code1", "code2", "code3"],
      };

      // Upload the coupon codes
      const apiResponse = await couponApi.uploadCouponCodes({
        couponOid: createdCoupon.coupon_oid,
        uploadCouponCodesRequest: codesRequest,
      });

      // Display results
      console.log("Uploaded codes:");
      for (const code of apiResponse.uploaded_codes ?? []) {
        console.log(code);
      }

      console.log("Duplicated codes:");
      for (const code of apiResponse.duplicate_codes ?? []) {
        console.log(code);
      }

      console.log("Rejected codes:");
      for (const code of apiResponse.rejected_codes ?? []) {
        console.log(code);
      }

      // Delete the coupon
      await couponApi.deleteCoupon({couponOid: createdCoupon.coupon_oid});
    } catch (ex) {
      console.log(`Error: ${(ex as Error).message}`);
      console.log((ex as Error).stack);
    }
  }
}

// Example usage (optional, remove if not needed)
// UploadCouponCodes.execute().catch(console.error);