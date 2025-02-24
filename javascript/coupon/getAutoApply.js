import { couponApi } from '../api.js';

export class GetAutoApply {
    /*
      getAutoApply returns back the items and subtotals that trigger "auto coupons", i.e. coupons that are automatically
      added to a shopping cart.  The manual configuration of auto coupons is at the bottom of the main coupons screen.
      See: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1376525/Coupons#Coupons-Navigation
    */
    static async execute() {
        console.log("--- GetAutoApply ---");

        try {

            // Get auto apply coupons information
            const apiResponse = await new Promise((resolve, reject) => {
                couponApi.getAutoApply(function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data, response);
                    }
                });
            });

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
        } catch (ex) {
            console.log(`Error: ${ex.message}`);
            console.log(ex.stack);
        }
    }
}