using System;
using SdkSample.auto_order;
using SdkSample.channel_partner;
using SdkSample.checkout;
using SdkSample.coupon;
using SdkSample.customer;
using SdkSample.fulfillment;
using SdkSample.gift_certificate;
using SdkSample.item;
using SdkSample.order;
using SdkSample.webhook;

namespace SdkSample
{
    public static class EntryPoint
    {
        public static void Main()
        {
            // No, I'm not using reflection to do this.
            // No, I'm not using unit tests to do this.
            // Yes, hard coding all methods like this has drawbacks.

            Console.WriteLine("============================================");
            Console.Out.WriteLine("--- AutoOrders ---");
            Console.WriteLine("============================================");
            ConsolidateAutoOrders.Execute();
            EstablishAutoOrderByReferenceOrderId.Execute();
            GetAutoOrder.Execute();
            GetAutoOrderByCode.Execute();
            GetAutoOrderByReferenceOrderId.Execute();
            GetAutoOrders.Execute();
            GetAutoOrdersBatch.Execute();
            GetAutoOrdersByQuery.Execute();
            UpdateAutoOrder.Execute();
            UpdateAutoOrdersBatch.Execute();

            Console.WriteLine("============================================");
            Console.Out.WriteLine("--- Channel Partner ---");
            Console.WriteLine("============================================");
            CancelOrderByChannelPartnerOrderId.Execute();
            CancelOrderByUltraCartOrderId.Execute();
            DeleteChannelPartnerShipToPreference.Execute();
            EstimateShippingForChannelPartnerOrder.Execute();
            EstimateTaxForChannelPartnerOrder.Execute();
            GetChannelPartnerOrder.Execute();
            GetChannelPartnerOrderByChannelPartnerOrderId.Execute();
            GetChannelPartners.Execute();
            GetChannelPartnerShipToPreference.Execute();
            GetChannelPartnerShipToPreferences.Execute();
            ImportChannelPartnerOrder.Execute();
            InsertChannelPartnerShipToPreference.Execute();
            RefundChannelPartnerOrder.Execute();
            UpdateChannelPartnerShipToPreference.Execute();

            Console.WriteLine("============================================");
            Console.Out.WriteLine("--- Checkout ---");
            Console.WriteLine("============================================");
            CityState.Execute();
            FinalizeOrder.Execute();
            GetAffirmCheckout.Execute();
            GetAllowedCountries.Execute();
            GetCart.Execute();
            GetCartByCartId.Execute();
            GetCartByReturnCode.Execute();
            GetCartByReturnToken.Execute();
            GetStateProvincesForCountry.Execute();
            HandoffCart.Execute();
            Login.Execute();
            Logout.Execute();
            Register.Execute();
            RegisterAffiliateClick.Execute();
            RelatedItemsForCart.Execute();
            RelatedItemsForItem.Execute();
            SetupBrowserKey.Execute();
            UpdateCart.Execute();
            ValidateCart.Execute();            
            
            Console.WriteLine("============================================");
            Console.Out.WriteLine("--- Coupons ---");
            Console.WriteLine("============================================");
            DeleteCoupon.Execute();
            DeleteCouponsByCode.Execute();
            DeleteCouponsByOid.Execute();
            InsertCoupon.Execute();
            InsertCoupons.Execute();
            DoesCouponCodeExist.Execute();
            GetCoupon.Execute();
            GetAutoApply.Execute();
            UpdateAutoApply.Execute();
            GetCouponByMerchantCode.Execute();
            UploadCouponCodes.Execute();
            UpdateCoupon.Execute();
            UpdateCoupons.Execute();
            GetCoupons.Execute();
            GetCouponsByQuery.Execute();
            GenerateCouponCodes.Execute();
            GenerateOneTimeCodesByMerchantCode.Execute();

            Console.WriteLine("============================================");
            Console.Out.WriteLine("--- Customers ---");
            Console.WriteLine("============================================");
            AddCustomerStoreCredit.Execute();
            AdjustInternalCertificate.Execute();
            DeleteCustomer.Execute();
            DeleteWishListItem.Execute();
            GetCustomer.Execute();
            GetCustomerByEmail.Execute();
            GetCustomers.Execute();
            GetCustomersByQuery.Execute();
            GetCustomerStoreCredit.Execute();
            GetCustomerWishList.Execute();
            GetCustomerWishListItem.Execute();
            GetEmailVerificationToken.Execute();
            GetMagicLink.Execute();
            InsertCustomer.Execute();
            InsertWishListItem.Execute();
            MergeCustomer.Execute();
            UpdateCustomer.Execute();
            UpdateWishListItem.Execute();
            ValidateEmailVerificationToken.Execute();            
            
            Console.WriteLine("============================================");
            Console.Out.WriteLine("--- Fulfillment ---");
            Console.WriteLine("============================================");
            AcknowledgeOrders.Execute();
            GeneratePackingSlip.Execute();
            GetDistributionCenterOrders.Execute();
            GetDistributionCenters.Execute();
            ShipOrders.Execute();
            UpdateInventory.Execute();

            Console.WriteLine("============================================");
            Console.Out.WriteLine("--- Gift Certificates ---");
            Console.WriteLine("============================================");
            AddGiftCertificateLedgerEntry.Execute();
            CreateGiftCertificate.Execute();
            DeleteGiftCertificate.Execute();
            GetGiftCertificateByCode.Execute();
            GetGiftCertificateByOid.Execute();
            GetGiftCertificatesByEmail.Execute();
            GetGiftCertificatesByQuery.Execute();
            UpdateGiftCertificate.Execute();          
            
            Console.WriteLine("============================================");
            Console.Out.WriteLine("--- Item ---");
            Console.WriteLine("============================================");
            DeleteDigitalItem.Execute();
            DeleteItem.Execute();
            DeleteReview.Execute();
            GetDigitalItem.Execute();
            GetDigitalItems.Execute();
            GetDigitalItemsByExternalId.Execute();
            GetItem.Execute();
            GetItemByMerchantItemId.Execute();
            GetItems.Execute();
            GetPricingTiers.Execute();
            GetReview.Execute();
            GetReviews.Execute();
            GetUnassociatedDigitalItems.Execute();
            InsertDigitalItem.Execute();
            InsertItem.Execute();
            InsertReview.Execute();
            InsertUpdateItemContentAttribute.Execute();
            UpdateDigitalItem.Execute();
            UpdateItem.Execute();
            UpdateItemMixMatchGroup.Execute();
            UpdateItems.Execute();
            UpdateReview.Execute();

            Console.WriteLine("============================================");
            Console.Out.WriteLine("--- Order ---");
            Console.WriteLine("============================================");
            AdjustOrderTotal.Execute();
            CancelOrder.Execute();
            DeleteOrder.Execute();
            DuplicateOrder.Execute();
            Format.Execute();
            GenerateInvoice.Execute();
            GenerateOrderToken.Execute();
            GeneratePackingSlipAllDC.Execute();
            GeneratePackingSlipSpecificDC.Execute();
            GetOrder.Execute();
            GetOrderByToken.Execute();
            GetOrderEdiDocuments.Execute();
            GetOrders.Execute();
            GetOrdersBatch.Execute();
            GetOrdersByQuery.Execute();
            IsRefundableOrder.Execute();
            ProcessPayment.Execute();
            RefundOrder.Execute();
            Replacement.Execute();
            ResendReceipt.Execute();
            ResendShipmentConfirmation.Execute();
            UpdateOrder.Execute();
            ValidateOrder.Execute();            
            
            Console.WriteLine("============================================");
            Console.Out.WriteLine("--- Webhook ---");
            Console.WriteLine("============================================");
            DeleteWebhook.Execute();
            DeleteWebhookByUrl.Execute();
            GetWebhookLog.Execute();
            GetWebhookLogSummaries.Execute();
            GetWebhooks.Execute();
            InsertWebhook.Execute();
            ResendEvent.Execute();
            UpdateWebhook.Execute();            
            
        }        
    }
}