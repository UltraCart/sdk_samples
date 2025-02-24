// Import API and UltraCart types
import { couponApi } from '../api.js';
import { DateTime } from 'luxon';

// Namespace-like structure using a class
export class UpdateCoupon {
  static async execute() {
    console.log(`--- UpdateCoupon ---`);

    try {
      // Generate a random 8-character merchant code (replacing GUID)
      const merchantCode = Math.random().toString(36).substring(2, 10);

      // Create the coupon and ensure it exists
      const coupon = {
        merchant_code: merchantCode,
        description: "Test coupon for GetCoupon",
        amount_off_subtotal: {
          currency: "USD",
          discountAmount: 0.01, // one penny discount, decimal becomes number
        },
      };

      // Insert the coupon
      const couponResponse = await new Promise((resolve, reject) => {
        couponApi.insertCoupon(coupon, function (error, data, response) {
          if (error) {
            reject(error);
          } else {
            resolve(data, response);
          }
        });
      });
      const createdCoupon = couponResponse.coupon;

      if (!createdCoupon?.coupon_oid) {
        throw new Error("Failed to create coupon; no OID returned");
      }

      // Update the coupon. This can be difficult given the complexity of coupons. See InsertCoupon sample for details.
      const updatedCouponData = {
        ...createdCoupon,
        expiration_dts: DateTime.now()
          .setZone('America/New_York')
          .plus({ days: 90 })
          .toISO(), // 90 days from now in ISO8601 format
      };

      // Update the coupon
      const updatedResponse = await new Promise((resolve, reject) => {
        couponApi.updateCoupon(createdCoupon.coupon_oid, updatedCouponData, function (error, data, response) {
          if (error) {
            reject(error);
          } else {
            resolve(data, response);
          }
        });
      });
      const updatedCoupon = updatedResponse.coupon;

      // Display the updated coupon
      console.log(updatedCoupon);
    } catch (ex) {
      console.log(`Error: ${ex.message}`);
      console.log(ex.stack);
    }
  }
}