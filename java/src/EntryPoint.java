public class EntryPoint {

  public static void main(String ... args) throws Throwable {
    // No, I'm not using reflection to do this.
    // No, I'm not using unit tests to do this.
    // Yes, hard coding all methods like this has drawbacks.

    System.out.println("---Gift Certificate---");
    gift_certificate.AddGiftCertificateLedgerEntry.main();
    gift_certificate.CreateGiftCertificate.main();
    gift_certificate.DeleteGiftCertificate.main();
    gift_certificate.GetGiftCertificateByCode.main();
    gift_certificate.GetGiftCertificateByOid.main();
    gift_certificate.GetGiftCertificatesByEmail.main();
    gift_certificate.GetGiftCertificatesByQuery.main();
    gift_certificate.UpdateGiftCertificate.main();

    System.out.println("---Order---");
    order.DuplicateOrder.main();

  }

}
