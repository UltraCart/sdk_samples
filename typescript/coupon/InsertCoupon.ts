// Import API and UltraCart types
import { couponApi } from '../api';
import { Coupon, CouponAmountOffSubtotal, CouponResponse } from 'ultracart_rest_api_v2_typescript';

// Namespace-like structure using a class
export class InsertCoupon {
  public static async execute(): Promise<void> {
    console.log(`--- InsertCoupon ---`);
    try {
      // Create a new coupon
      const coupon: Coupon = {
        merchant_code: "InsertCouponSample",
        description: "One penny off subtotal",
        // Each coupon must have a 'type' defined by creating a child object directly beneath the main Coupon object.
        // This is complex and there are a LOT of coupon types. See the backend (secure.ultracart.com) coupon screens
        // to get an idea of what functionality each coupon possesses. If you're not sure, contact UltraCart support.
        amount_off_subtotal: {
          discount_amount: 0.01, // Decimal becomes number in TypeScript
        } as CouponAmountOffSubtotal,
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

      const expand: string | undefined = undefined; // coupons do not have expansions

      // UltraCart API call with parameters as an anonymous interface
      const apiResponse = await couponApi.insertCoupon({
        coupon: coupon,
        expand: expand,
      });

      const createdCoupon = apiResponse.coupon;
      console.log("Created the following temporary coupon:");
      console.log(`Coupon OID: ${createdCoupon?.coupon_oid}`);
      console.log(`Coupon Type: ${createdCoupon?.coupon_type}`);
      console.log(`Coupon Description: ${createdCoupon?.description}`);

      console.log("Deleting newly created coupon to clean up.");
      if (createdCoupon?.coupon_oid) {
        await couponApi.deleteCoupon({couponOid: createdCoupon.coupon_oid});
      }
    } catch (ex) {
      console.log(`Error: ${(ex as Error).message}`);
      console.log((ex as Error).stack);
    }
  }
}
