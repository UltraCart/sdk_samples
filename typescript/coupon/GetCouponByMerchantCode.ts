import { couponApi } from '../api';
import { Coupon, CouponAmountOffSubtotal, CouponResponse } from 'ultracart_rest_api_v2_typescript';

export class GetCouponByMerchantCode {
    public static async execute(): Promise<void> {
        console.log("--- GetCouponByMerchantCode ---");

        try {

            const merchantCode: string = this.generateGuid().substring(0, 8);

            // Now create the coupon and ensure it exists.
            const coupon: Coupon = {
                merchant_code: merchantCode,
                description: "Test coupon for GetCoupon",
                amount_off_subtotal: { currency_code: "USD", discount_amount: 0.01 } as CouponAmountOffSubtotal
            }; // one penny discount.

            const couponResponse: CouponResponse = await couponApi.insertCoupon({coupon: coupon});
            const createdCoupon: Coupon = couponResponse.coupon!;

            console.log("Created the following temporary coupon:");
            console.log(`Coupon OID: ${createdCoupon.coupon_oid}`);
            console.log(`Coupon Type: ${createdCoupon.coupon_type}`);
            console.log(`Coupon Description: ${createdCoupon.description}`);

            const retrievedResponse: CouponResponse = await couponApi.getCouponByMerchantCode({merchantCode: merchantCode});
            const copyOfCoupon: Coupon = retrievedResponse.coupon!;
            console.log("GetCoupon returned the following coupon:");
            console.log(`Coupon OID: ${copyOfCoupon.coupon_oid}`);
            console.log(`Coupon Type: ${copyOfCoupon.coupon_type}`);
            console.log(`Coupon Description: ${copyOfCoupon.description}`);

            // Delete the coupon
            await couponApi.deleteCoupon({couponOid: createdCoupon.coupon_oid!});
        } catch (ex: any) {
            console.log(`Error: ${ex.message}`);
            console.log(ex.stack);
        }
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

