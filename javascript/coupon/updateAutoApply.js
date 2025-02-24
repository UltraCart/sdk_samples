// Import API and UltraCart types
import { couponApi } from '../api.js';

// Namespace-like structure using a class
export class UpdateAutoApply {
  /*
   * updateAutoApply updates the items and subtotals conditions that trigger "auto coupons", i.e. coupons that are automatically
   * added to a shopping cart. The manual configuration of auto coupons is at the bottom of the main coupons screen.
   * See: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1376525/Coupons#Coupons-Navigation
   *
   * // Success is 200 (There is no content. Yes, this should return a 204, but it returns a 200 with no content)
   */
  static async execute() {
    console.log(`--- UpdateAutoApply ---`);

    try {
      // Create auto apply conditions
      const autoApply = {};

      // Create item condition
      const itemCondition = {
        required_item_id: "ITEM_ABC",
        coupon_code: "10OFF",
      };
      const itemConditions = [itemCondition];

      // Create subtotal condition
      const subtotalCondition = {
        minimum_subtotal: 50, // must spend fifty dollars
        coupon_code: "5OFF", // Corrected from item condition in original code
      };
      const subtotalConditions = [subtotalCondition];

      // Set conditions to auto apply object
      autoApply.required_items = itemConditions;
      autoApply.subtotal_levels = subtotalConditions;

      // Update auto apply conditions
      const response = await new Promise((resolve, reject) => {
        couponApi.updateAutoApply(autoApply, function (error, data, response) {
          if (error) {
            reject(error);
          } else {
            resolve(data, response);
          }
        });
      });

      console.log("Auto apply conditions updated successfully");
    } catch (ex) {
      console.log(`Error: ${ex.message}`);
      console.log(ex.stack);
    }
  }
}