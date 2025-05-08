import coupon.*;

public class EntryPoint {

  public static void main(String ... args) throws Throwable {
    // No, I'm not using reflection to do this.
    // No, I'm not using unit tests to do this.
    // Yes, hard coding all methods like this has drawbacks.

    System.out.println("--- Coupon ---");
    DeleteCoupon.execute();
    DeleteCouponsByCode.execute();
    DeleteCouponsByOid.execute();
    DoesCouponCodeExist.execute();
    GenerateCouponCodes.execute();
    GenerateOneTimeCodesByMerchantCode.execute();
    GetAutoApply.execute();
    GetCoupon.execute();
    GetCouponByMerchantCode.execute();
    GetCoupons.execute();
    GetCouponsByQuery.execute();
    InsertCoupon.execute();
    InsertCoupons.Execute();
    UpdateAutoApply.Execute();
    UpdateCoupon.Execute();
    UpdateCoupons.Execute();
    UploadCouponCodes.Execute();
    
//    System.out.println("--- Auto Order ---");
//    ConsolidateAutoOrders.execute();
//    EstablishAutoOrderByReferenceOrderId.execute();
//    GetAutoOrder.execute();
//    GetAutoOrderByCode.execute();
//    GetAutoOrderByReferenceOrderId.execute();
//    GetAutoOrders.execute();
//    GetAutoOrdersBatch.execute();
//    PauseAutoOrder.execute();
//    UpdateAutoOrder.execute();
//    UpdateAutoOrdersBatch.execute();
//
//    System.out.println("--- Gift Certificate ---");
//    AddGiftCertificateLedgerEntry.execute();
//    CreateGiftCertificate.execute();
//    DeleteGiftCertificate.execute();
//    GetGiftCertificateByCode.execute();
//    GetGiftCertificateByOid.execute();
//    GetGiftCertificatesByEmail.execute();
//    GetGiftCertificatesByQuery.execute();
//    UpdateGiftCertificate.execute();
//
//    System.out.println("--- Order ---");
//    DuplicateOrder.execute();

  }

}
