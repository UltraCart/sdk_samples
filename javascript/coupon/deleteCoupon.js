import {couponApi} from '../api.js';

export class DeleteCoupon {
    /**
     * Deletes a specific coupon using the UltraCart API
     */
    static async execute() {
        console.log("--- DeleteCoupon ---");

        const expand = undefined; // coupons do not have expansions.

        const coupon = {
            merchant_code: this.generateGuid().substring(0, 8),
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

        const couponOid = createdCoupon.coupon_oid;

        // Delete the coupon
        await new Promise((resolve, reject) => {
            couponApi.deleteCoupon(couponOid, function (error, data, response) {
                if (error) {
                    reject(error);
                } else {
                    resolve(data, response);
                }
            });
        });

        console.log(`Successfully deleted coupon with ID: ${couponOid}`);
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