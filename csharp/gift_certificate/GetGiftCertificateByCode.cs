using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.gift_certificate
{
    // ReSharper disable once ClassNeverInstantiated.Global
    public class GetGiftCertificateByCode
    {
        public static void Execute()
        {
            var giftCertificate = GetGiftCertificateByCodeCall();
            Utility.DumpObject(giftCertificate, "Gift Certificate");
        }

        // ReSharper disable once MemberCanBePrivate.Global
        public static GiftCertificate GetGiftCertificateByCodeCall()
        {
            var api = new GiftCertificateApi(Constants.ApiKey);
            
            const string code = "X8PV761V2Z";

            // by_code does not take an expansion variable.  it will return the entire object by default.
            var gcResponse = api.GetGiftCertificateByCode(code);
            return gcResponse.GiftCertificate;
        }
    }
}