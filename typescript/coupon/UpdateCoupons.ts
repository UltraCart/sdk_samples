// Import API and UltraCart types
import { couponApi } from '../api';
import { Coupon, CouponAmountOffSubtotal, CouponsRequest } from 'ultracart_rest_api_v2_typescript';
import { DateTime } from 'luxon';

// Namespace-like structure using a class
export class UpdateCoupons {
  public static async execute(): Promise<void> {
    console.log(`--- UpdateCoupons ---`);

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

      // Update the coupon. This can be difficult given the complexity of coupons. See InsertCoupon sample for details.
      const updatedCouponData: Coupon = {
        ...createdCoupon,
        expiration_dts: DateTime.now()
          .setZone('America/New_York')
          .plus({ days: 90 })
          .toISO(), // 90 days from now in ISO8601 format
      };

      // This example only has one coupon. But it's a trivial matter to add more coupons
      const couponsRequest: CouponsRequest = {
        coupons: [updatedCouponData],
      };

      // Update the coupons
      const updatedResponse = await couponApi.updateCoupons({
        couponsRequest: couponsRequest,
      });
      const updatedCoupons = updatedResponse.coupons ?? [];

      // Display the updated coupons
      for (const updatedCoupon of updatedCoupons) {
        console.log(updatedCoupon);
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
// UpdateCoupons.execute().catch(console.error);