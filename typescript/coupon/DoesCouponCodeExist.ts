import { couponApi } from '../api';
import {
    Coupon,
    CouponAmountOffSubtotal,
    CouponResponse,
    CouponExistsResponse,
    DoesCouponCodeExistRequest
} from 'ultracart_rest_api_v2_typescript';

export class DoesCouponCodeExist {
    public static async execute(): Promise<void> {
        console.log("--- DoesCouponCodeExist ---");

        try {
            const api = couponApi;

            const merchantCode: string = this.generateGuid().substring(0, 8);
            const couponExistsResponse: CouponExistsResponse = await api.doesCouponCodeExist({merchantCode: merchantCode});
            // The response should be false.
            if (couponExistsResponse._exists) {
                throw new Error("CouponApi.doesCouponCodeExist should have returned false since we are checking for a fake coupon.");
            }

            // Now create the coupon and ensure it exists.
            const coupon: Coupon = {
                merchant_code: merchantCode,
                description: "Test coupon for DoesCouponCodeExist",
                amount_off_subtotal: { currency_code: "USD", discount_amount: 0.01 } as CouponAmountOffSubtotal
            }; // one penny discount.

            const couponResponse: CouponResponse = await api.insertCoupon({coupon: coupon});
            const createdCoupon: Coupon = couponResponse.coupon!;

            console.log("Created the following temporary coupon:");
            console.log(`Coupon OID: ${createdCoupon.merchant_code}`);
            console.log(`Coupon Type: ${createdCoupon.coupon_type}`);
            console.log(`Coupon Description: ${createdCoupon.description}`);

            const secondExistsResponse: CouponExistsResponse = await api.doesCouponCodeExist({merchantCode: merchantCode});
            if (!secondExistsResponse._exists) {
                throw new Error(
                    "CouponApi.doesCouponCodeExist should have returned true after creating the coupon."
                );
            }

            // Delete the coupon
            await api.deleteCoupon({couponOid: createdCoupon.coupon_oid!});
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
