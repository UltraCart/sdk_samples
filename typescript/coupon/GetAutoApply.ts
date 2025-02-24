import { couponApi } from '../api';
import {CouponAutoApplyConditions} from 'ultracart_rest_api_v2_typescript';

export class GetAutoApply {
    /*
      getAutoApply returns back the items and subtotals that trigger "auto coupons", i.e. coupons that are automatically
      added to a shopping cart.  The manual configuration of auto coupons is at the bottom of the main coupons screen.
      See: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1376525/Coupons#Coupons-Navigation
    */
    public static async execute(): Promise<void> {
        console.log("--- GetAutoApply ---");

        try {

            // Get auto apply coupons information
            const apiResponse: CouponAutoApplyConditions = await couponApi.getAutoApply();

            // Display subtotal levels
            console.log("These are the subtotal levels:");
            for (const subtotalLevel of apiResponse.subtotal_levels || []) {
                console.log(subtotalLevel);
            }

            // Display item triggers
            console.log("These are the item triggers:");
            for (const requiredItem of apiResponse.required_items || []) {
                console.log(requiredItem);
            }
        } catch (ex: any) {
            console.log(`Error: ${ex.message}`);
            console.log(ex.stack);
        }
    }
}
