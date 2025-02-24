// Import API and UltraCart types
import { couponApi } from '../api';
import { Coupon, CouponAmountOffSubtotal, CouponsRequest } from 'ultracart_rest_api_v2_typescript';

// Namespace-like structure using a class
export class InsertCoupons {
  public static async execute(): Promise<void> {
    console.log(`--- InsertCoupons ---`);
    try {
      // Create coupon objects
      const coupon1: Coupon = {
        merchant_code: "PennyOff",
        description: "Test Coupon for InsertCoupons sample",
        amount_off_subtotal: {
          discount_amount: 0.01, // Decimal becomes number in TypeScript
        } as CouponAmountOffSubtotal, // See InsertCoupon for examples of types
      };

      const coupon2: Coupon = {
        merchant_code: "TwoPenniesOff",
        description: "Test Coupon for InsertCoupons sample",
        amount_off_subtotal: {
          discount_amount: 0.02, // Decimal becomes number in TypeScript
        } as CouponAmountOffSubtotal, // See InsertCoupon for examples of types
      };

      // Create CouponsRequest object
      const couponsRequest: CouponsRequest = {
        coupons: [coupon1, coupon2],
      };

      // UltraCart API call with parameters as an anonymous interface
      const apiResponse = await couponApi.insertCoupons({
        couponsRequest: couponsRequest,
      });

      console.log(apiResponse);

      // Clean up: delete newly created coupons
      if (apiResponse.coupons) {
        for (const coupon of apiResponse.coupons) {
          console.log(`Deleting newly created coupon (Coupon OID ${coupon.coupon_oid}) to clean up.`);
          if (coupon.coupon_oid) {
            await couponApi.deleteCoupon({couponOid: coupon.coupon_oid});
          }
        }
      }
    } catch (ex) {
      console.log(`Error: ${(ex as Error).message}`);
      console.log((ex as Error).stack);
    }
  }
}

// Example usage (optional, remove if not needed)
InsertCoupons.execute().catch(console.error);