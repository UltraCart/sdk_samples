using System;
using SdkSample.auto_order;
using SdkSample.channel_partner;
using SdkSample.coupon;
using SdkSample.fulfillment;
using SdkSample.gift_certificate;

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
            
        }        
    }
}