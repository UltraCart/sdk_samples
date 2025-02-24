// Import API and UltraCart types
import { couponApi } from '../api.js';

// Namespace-like structure using a class
export class InsertCoupons {
  static async execute() {
    console.log(`--- InsertCoupons ---`);
    try {
      // Create coupon objects
      const coupon1 = {
        merchant_code: "PennyOff",
        description: "Test Coupon for InsertCoupons sample",
        amount_off_subtotal: {
          discount_amount: 0.01, // Decimal becomes number in TypeScript
        }, // See InsertCoupon for examples of types
      };

      const coupon2 = {
        merchant_code: "TwoPenniesOff",
        description: "Test Coupon for InsertCoupons sample",
        amount_off_subtotal: {
          discount_amount: 0.02, // Decimal becomes number in TypeScript
        }, // See InsertCoupon for examples of types
      };

      // Create CouponsRequest object
      const couponsRequest = {
        coupons: [coupon1, coupon2],
      };

      const apiResponse = await new Promise((resolve, reject) => {
        couponApi.insertCoupons(couponsRequest, function (error, data, response) {
          if (error) {
            reject(error);
          } else {
            resolve(data, response);
          }
        });
      });

      console.log(apiResponse);

      // Clean up: delete newly created coupons
      if (apiResponse.coupons) {
        for (const coupon of apiResponse.coupons) {
          console.log(`Deleting newly created coupon (Coupon OID ${coupon.coupon_oid}) to clean up.`);
          if (coupon.coupon_oid) {
            await new Promise((resolve, reject) => {
              couponApi.deleteCoupon(coupon.coupon_oid, function (error, data, response) {
                if (error) {
                  reject(error);
                } else {
                  resolve(data, response);
                }
              });
            });
          }
        }
      }
    } catch (ex) {
      console.log(`Error: ${ex.message}`);
      console.log(ex.stack);
    }
  }
}

// Example usage (optional, remove if not needed)
// InsertCoupons.execute().catch(console.error);