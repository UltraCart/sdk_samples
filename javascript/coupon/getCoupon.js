import { couponApi } from '../api.js';

export class GetCoupon {
    static async execute() {
        console.log("--- GetCoupon ---");

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

            console.log("Created the following temporary coupon:");
            console.log(`Coupon OID: ${createdCoupon.coupon_oid}`);
            console.log(`Coupon Type: ${createdCoupon.coupon_type}`);
            console.log(`Coupon Description: ${createdCoupon.description}`);

            const retrievedResponse = await new Promise((resolve, reject) => {
                couponApi.getCoupon(createdCoupon.coupon_oid, function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data, response);
                    }
                });
            });

            const copyOfCoupon = retrievedResponse.coupon;
            console.log("GetCoupon returned the following coupon:");
            console.log(`Coupon OID: ${copyOfCoupon.coupon_oid}`);
            console.log(`Coupon Type: ${copyOfCoupon.coupon_type}`);
            console.log(`Coupon Description: ${copyOfCoupon.description}`);

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