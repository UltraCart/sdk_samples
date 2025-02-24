import { couponApi } from '../api.js';

export class DoesCouponCodeExist {
    static async execute() {
        console.log("--- DoesCouponCodeExist ---");

        try {
            const api = couponApi;

            const merchantCode = this.generateGuid().substring(0, 8);

            const couponExistsResponse = await new Promise((resolve, reject) => {
                api.doesCouponCodeExist(merchantCode, function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data, response);
                    }
                });
            });

            // The response should be false.
            if (couponExistsResponse._exists) {
                throw new Error("CouponApi.doesCouponCodeExist should have returned false since we are checking for a fake coupon.");
            }

            // Now create the coupon and ensure it exists.
            const coupon = {
                merchant_code: merchantCode,
                description: "Test coupon for DoesCouponCodeExist",
                amount_off_subtotal: { currency_code: "USD", discount_amount: 0.01 }
            }; // one penny discount.

            const couponResponse = await new Promise((resolve, reject) => {
                api.insertCoupon(coupon, function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data, response);
                    }
                });
            });

            const createdCoupon = couponResponse.coupon;

            console.log("Created the following temporary coupon:");
            console.log(`Coupon OID: ${createdCoupon.merchant_code}`);
            console.log(`Coupon Type: ${createdCoupon.coupon_type}`);
            console.log(`Coupon Description: ${createdCoupon.description}`);

            const secondExistsResponse = await new Promise((resolve, reject) => {
                api.doesCouponCodeExist(merchantCode, function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data, response);
                    }
                });
            });

            if (!secondExistsResponse._exists) {
                throw new Error(
                    "CouponApi.doesCouponCodeExist should have returned true after creating the coupon."
                );
            }

            // Delete the coupon
            await new Promise((resolve, reject) => {
                api.deleteCoupon(createdCoupon.coupon_oid, function (error, data, response) {
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