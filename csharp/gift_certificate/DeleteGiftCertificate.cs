using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.gift_certificate
{
    // ReSharper disable once ClassNeverInstantiated.Global
    public class DeleteGiftCertificate
    {
        public static void Execute()
        {
            var giftCertificate = DeleteGiftCertificateCall();
            Utility.DumpObject(giftCertificate, "Gift Certificate");
        }

        // ReSharper disable once MemberCanBePrivate.Global
        public static GiftCertificate DeleteGiftCertificateCall()
        {
            var api = new GiftCertificateApi(Constants.ApiKey);
            
            const int giftCertificateOid = 676713;
            api.DeleteGiftCertificate(giftCertificateOid);

            // if I re-query the gift certificate after deleting, I will still get an object back, but the
            // deleted flag on the object will be true.
            // by_oid does not take an expansion variable.  it will return the entire object by default.
            var gcResponse = api.GetGiftCertificateByOid(giftCertificateOid);
            return gcResponse.GiftCertificate;
        }
    }
}