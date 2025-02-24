import {couponApi} from '../api';
import {
    Coupon,
    CouponAmountOffSubtotal, CouponDeletesRequest,
    CouponResponse, DeleteCouponsByCodeRequest
} from 'ultracart_rest_api_v2_typescript';

export class DeleteCouponByCode {
    /**
     * Deletes a specific coupon using the UltraCart API
     */
    public static async execute(): Promise<void> {
        console.log("--- DeleteCouponByCode ---");

        const expand: string | undefined = undefined; // coupons do not have expansions.

        const merchant_code: string = this.generateGuid().substring(0, 8);

        const coupon: Coupon = {
            merchant_code: merchant_code,
            description: "Test coupon for sdk_sample.coupon.DeleteCoupon",
            amount_off_subtotal: {currency_code: "USD", discount_amount: 0.01} as CouponAmountOffSubtotal
        }; // one penny discount.

        const couponResponse: CouponResponse = await couponApi.insertCoupon({coupon: coupon, expand: expand});
        const createdCoupon: Coupon = couponResponse.coupon!;

        console.log("Created the following temporary coupon:");
        console.log(`Coupon OID: ${createdCoupon.coupon_oid}`);
        console.log(`Coupon Type: ${createdCoupon.coupon_type}`);
        console.log(`Coupon Description: ${createdCoupon.description}`);

        await couponApi.deleteCouponsByCode({couponDeleteRequest: {coupon_codes: [merchant_code]}});

        console.log(`Successfully deleted coupon with merchant_code: ${merchant_code}`);
    }

    // Helper method to generate a GUID-like string since TypeScript doesn't have Guid.NewGuid()
    private static generateGuid(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        }).replace(/-/g, '');
    }
}