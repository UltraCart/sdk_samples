// Import API and UltraCart types
import { couponApi } from '../api.js';

// Namespace-like structure using a class
export class InsertCoupon {
  static async execute() {
    console.log(`--- InsertCoupon ---`);
    try {
      // Create a new coupon
      const coupon = {
        merchant_code: "InsertCouponSample",
        description: "One penny off subtotal",
        // Each coupon must have a 'type' defined by creating a child object directly beneath the main Coupon object.
        // This is complex and there are a LOT of coupon types. See the backend (secure.ultracart.com) coupon screens
        // to get an idea of what functionality each coupon possesses. If you're not sure, contact UltraCart support.
        amount_off_subtotal: {
          discount_amount: 0.01, // Decimal becomes number in TypeScript
        },
      };

      // Here are the different coupon types, but beware that new coupons are added frequently.
      // CouponAmountOffItems
      // CouponAmountOffShipping
      // CouponAmountOffShippingWithItemsPurchase
      // CouponAmountOffSubtotal
      // CouponAmountOffSubtotalAndShipping
      // CouponAmountOffSubtotalFreeShippingWithPurchase
      // CouponAmountOffSubtotalWithBlockPurchase
      // CouponAmountOffSubtotalWithItemsPurchase
      // CouponAmountOffSubtotalWithPurchase
      // CouponAmountShippingWithSubtotal
      // CouponDiscountItems
      // CouponDiscountItemWithItemPurchase
      // CouponFreeItemAndShippingWithSubtotal
      // CouponFreeItemsWithItemPurchase
      // CouponFreeItemsWithMixMatchPurchase
      // CouponFreeItemWithItemPurchase
      // CouponFreeItemWithItemPurchaseAndFreeShipping
      // CouponFreeItemWithSubtotal
      // CouponFreeShipping
      // CouponFreeShippingSpecificItems
      // CouponFreeShippingWithItemsPurchase
      // CouponFreeShippingWithSubtotal
      // CouponMoreLoyaltyCashback
      // CouponMoreLoyaltyPoints
      // CouponMultipleAmountsOffItems
      // CouponNoDiscount
      // CouponPercentMoreLoyaltyCashback
      // CouponPercentMoreLoyaltyPoints
      // CouponPercentOffItems
      // CouponPercentOffItemsAndFreeShipping
      // CouponPercentOffItemsWithItemsPurchase
      // CouponPercentOffItemWithItemsQuantityPurchase
      // CouponPercentOffMsrpItems
      // CouponPercentOffRetailPriceItems
      // CouponPercentOffShipping
      // CouponPercentOffSubtotal
      // CouponPercentOffSubtotalAndFreeShipping
      // CouponPercentOffSubtotalLimit
      // CouponPercentOffSubtotalWithItemsPurchase
      // CouponPercentOffSubtotalWithSubtotal
      // CouponTieredAmountOffItems
      // CouponTieredAmountOffSubtotal
      // CouponTieredPercentOffItems
      // CouponTieredPercentOffShipping
      // CouponTieredPercentOffSubtotal
      // CouponTieredPercentOffSubtotalBasedOnMSRP
      // CouponTierItemDiscount
      // CouponTierPercent
      // CouponTierQuantityAmount
      // CouponTierQuantityPercent

      const expand = undefined; // coupons do not have expansions

      const apiResponse = await new Promise((resolve, reject) => {
        couponApi.insertCoupon(coupon, {_expand: expand}, function (error, data, response) {
          if (error) {
            reject(error);
          } else {
            resolve(data, response);
          }
        });
      });

      const createdCoupon = apiResponse.coupon;
      console.log("Created the following temporary coupon:");
      console.log(`Coupon OID: ${createdCoupon?.coupon_oid}`);
      console.log(`Coupon Type: ${createdCoupon?.coupon_type}`);
      console.log(`Coupon Description: ${createdCoupon?.description}`);

      console.log("Deleting newly created coupon to clean up.");
      if (createdCoupon?.coupon_oid) {

        await new Promise((resolve, reject) => {
          couponApi.deleteCoupon(createdCoupon.coupon_oid, function (error, data, response) {
            if (error) {
              reject(error);
            } else {
              resolve(data, response);
            }
          });
        });
      }
    } catch (ex) {
      console.log(`Error: ${ex.message}`);
      console.log(ex.stack);
    }
  }
}