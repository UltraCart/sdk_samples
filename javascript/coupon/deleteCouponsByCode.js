import {couponApi} from '../api.js';

export class DeleteCouponByCode {
    /**
     * Deletes a specific coupon using the UltraCart API
     */
    static async execute() {
        console.log("--- DeleteCouponByCode ---");

        const expand = undefined; // coupons do not have expansions.

        const merchant_code = this.generateGuid().substring(0, 8);

        const coupon = {
            merchant_code: merchant_code,
            description: "Test coupon for sdk_sample.coupon.DeleteCoupon",
            amount_off_subtotal: {currency_code: "USD", discount_amount: 0.01}
        }; // one penny discount.

        const couponResponse = await new Promise((resolve, reject) => {
            couponApi.insertCoupon(coupon, {_expand: expand}, function (error, data, response) {
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

        await new Promise((resolve, reject) => {
            couponApi.deleteCouponsByCode({coupon_codes: [merchant_code]}, function (error, data, response) {
                if (error) {
                    reject(error);
                } else {
                    resolve(data, response);
                }
            });
        });

        console.log(`Successfully deleted coupon with merchant_code: ${merchant_code}`);
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