import { couponApi } from '../api.js';
import { DateTime } from 'luxon';

export class GenerateCouponCodes {
    static async execute() {
        console.log("--- GenerateCouponCodes ---");

        try {

            const merchantCode = this.generateGuid().substring(0, 8);

            // Now create the coupon and ensure it exists.
            const coupon = {
                merchant_code: merchantCode,
                description: "Test coupon for GetCoupon",
                amount_off_subtotal: { currency_code: "USD", discount_amount: 0.01 }
            }; // one penny discount.

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

            const codesRequest = {
                quantity: 5, // give me 5 codes.
                expiration_dts: DateTime.utc().plus({ days: 90 }).toISO() // do you want the codes to expire?
                // expirationSeconds: null // also an option for short-lived coupons
            };

            const apiResponse = await new Promise((resolve, reject) => {
                couponApi.generateCouponCodes(createdCoupon.coupon_oid, codesRequest, function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data, response);
                    }
                });
            });

            const couponCodes = apiResponse.coupon_codes;

            // Display generated coupon codes
            console.log(`Generated ${couponCodes.length} coupon codes:`);
            for (const code of couponCodes) {
                console.log(code);
            }

            // Delete the coupon
            await new Promise((resolve, reject) => {
                couponApi.deleteCoupon(createdCoupon.coupon_oid, function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data, response);
                    }
                });
            });

        } catch (ex) {
            console.log(`Error: ${ex.message}`);
            console.log(ex.stack);
        }
    }

    // Helper method to generate a GUID-like string since TypeScript doesn't have Guid.NewGuid()
    static generateGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        }).replace(/-/g, '');
    }
}