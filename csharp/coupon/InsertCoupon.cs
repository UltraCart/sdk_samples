using System;
using System.Reflection;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.coupon
{
    public class InsertCoupon
    {
        public static void Execute()
        {
            Console.WriteLine("--- " + MethodBase.GetCurrentMethod()?.DeclaringType?.Name + " ---");
            try
            {
                // Create coupon API instance using API key
                CouponApi couponApi = new CouponApi(Constants.ApiKey);

                // Create a new coupon
                Coupon coupon = new Coupon();
                coupon.MerchantCode = "InsertCouponSample";
                coupon.Description ="One penny off subtotal";

                // Each coupon must have a 'type' defined by creating a child object directly beneath the main Coupon object.
                // This is complex and there are a LOT of coupon types. See the backend (secure.ultracart.com) coupon screens
                // to get an idea of what functionality each coupon possesses. If you're not sure, contact UltraCart support.
                coupon.AmountOffSubtotal = new CouponAmountOffSubtotal();
                coupon.AmountOffSubtotal.DiscountAmount = 0.01m;

                // Here are the different coupon types, but beware that new coupons are added frequently.
                //CouponAmountOffItems
                //CouponAmountOffShipping
                //CouponAmountOffShippingWithItemsPurchase
                //CouponAmountOffSubtotal
                //CouponAmountOffSubtotalAndShipping
                //CouponAmountOffSubtotalFreeShippingWithPurchase
                //CouponAmountOffSubtotalWithBlockPurchase
                //CouponAmountOffSubtotalWithItemsPurchase
                //CouponAmountOffSubtotalWithPurchase
                //CouponAmountShippingWithSubtotal
                //CouponDiscountItems
                //CouponDiscountItemWithItemPurchase
                //CouponFreeItemAndShippingWithSubtotal
                //CouponFreeItemsWithItemPurchase
                //CouponFreeItemsWithMixMatchPurchase
                //CouponFreeItemWithItemPurchase
                //CouponFreeItemWithItemPurchaseAndFreeShipping
                //CouponFreeItemWithSubtotal
                //CouponFreeShipping
                //CouponFreeShippingSpecificItems
                //CouponFreeShippingWithItemsPurchase
                //CouponFreeShippingWithSubtotal
                //CouponMoreLoyaltyCashback
                //CouponMoreLoyaltyPoints
                //CouponMultipleAmountsOffItems
                //CouponNoDiscount
                //CouponPercentMoreLoyaltyCashback
                //CouponPercentMoreLoyaltyPoints
                //CouponPercentOffItems
                //CouponPercentOffItemsAndFreeShipping
                //CouponPercentOffItemsWithItemsPurchase
                //CouponPercentOffItemWithItemsQuantityPurchase
                //CouponPercentOffMsrpItems
                //CouponPercentOffRetailPriceItems
                //CouponPercentOffShipping
                //CouponPercentOffSubtotal
                //CouponPercentOffSubtotalAndFreeShipping
                //CouponPercentOffSubtotalLimit
                //CouponPercentOffSubtotalWithItemsPurchase
                //CouponPercentOffSubtotalWithSubtotal
                //CouponTieredAmountOffItems
                //CouponTieredAmountOffSubtotal
                //CouponTieredPercentOffItems
                //CouponTieredPercentOffShipping
                //CouponTieredPercentOffSubtotal
                //CouponTieredPercentOffSubtotalBasedOnMSRP
                //CouponTierItemDiscount
                //CouponTierPercent
                //CouponTierQuantityAmount
                //CouponTierQuantityPercent

                string expand = null; // coupons do not have expansions
                var apiResponse = couponApi.InsertCoupon(coupon, expand);
                
                coupon = apiResponse.Coupon;
                Console.WriteLine("Created the following temporary coupon:");
                Console.WriteLine($"Coupon OID: {coupon.CouponOid}");
                Console.WriteLine($"Coupon Type: {coupon.CouponType}");
                Console.WriteLine($"Coupon Description: {coupon.Description}");
                
                Console.WriteLine("Deleting newly created coupon to clean up.");
                couponApi.DeleteCoupon(coupon.CouponOid);
                
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                Console.WriteLine(ex.StackTrace);
            }
        }
    }
}