using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.gift_certificate
{
    // ReSharper disable once ClassNeverInstantiated.Global
    public class GetGiftCertificateByOid
    {
        // uncomment to run.  C# projects can only have one main.
        // public static void Main()
        // {
        //     var giftCertificate = GetGiftCertificateByOidCall();
        //     Utility.DumpObject(giftCertificate, "Gift Certificate");
        // }

        // ReSharper disable once MemberCanBePrivate.Global
        public static GiftCertificate GetGiftCertificateByOidCall()
        {
            var api = new GiftCertificateApi(Constants.API_KEY);
            
            const int giftCertificateOid = 676713;

            // by_oid does not take an expansion variable.  it will return the entire object by default.
            var gcResponse = api.GetGiftCertificateByOid(giftCertificateOid);
            return gcResponse.GiftCertificate;
        }
    }
}