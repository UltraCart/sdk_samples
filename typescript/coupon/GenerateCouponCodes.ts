import { couponApi } from '../api';
import { Coupon, CouponAmountOffSubtotal, CouponResponse, CouponCodesRequest, CouponCodesResponse } from 'ultracart_rest_api_v2_typescript';
import { DateTime } from 'luxon';

export class GenerateCouponCodes {
    public static async execute(): Promise<void> {
        console.log("--- GenerateCouponCodes ---");

        try {

            const merchantCode: string = this.generateGuid().substring(0, 8);

            // Now create the coupon and ensure it exists.
            const coupon: Coupon = {
                merchant_code: merchantCode,
                description: "Test coupon for GetCoupon",
                amount_off_subtotal: { currency_code: "USD", discount_amount: 0.01 } as CouponAmountOffSubtotal
            }; // one penny discount.

            const couponResponse: CouponResponse = await couponApi.insertCoupon({coupon:coupon});
            const createdCoupon: Coupon = couponResponse.coupon!;

            const codesRequest: CouponCodesRequest = {
                quantity: 5, // give me 5 codes.
                expiration_dts: DateTime.utc().plus({ days: 90 }).toISO() // do you want the codes to expire?
                // expirationSeconds: null // also an option for short-lived coupons
            };

            const apiResponse: CouponCodesResponse = await couponApi.generateCouponCodes({couponOid: createdCoupon.coupon_oid!, couponCodesRequest: codesRequest});
            const couponCodes: string[] = apiResponse.coupon_codes!;

            // Display generated coupon codes
            console.log(`Generated ${couponCodes.length} coupon codes:`);
            for (const code of couponCodes) {
                console.log(code);
            }

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
