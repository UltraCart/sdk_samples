using System;
using SdkSample.auto_order;
using SdkSample.coupon;

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
            Console.Out.WriteLine("---AutoOrders---");
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
            Console.Out.WriteLine("---Coupons---");
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

        }        
    }
}