using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.gift_certificate
{
    // ReSharper disable once ClassNeverInstantiated.Global
    public class UpdateGiftCertificate
    {
        // uncomment to run.  C# projects can only have one main.
        // public static void Main()
        // {
        //     var giftCertificate = UpdateGiftCertificateCall();
        //     Utility.DumpObject(giftCertificate, "Gift Certificate");
        // }

        // ReSharper disable once MemberCanBePrivate.Global
        public static GiftCertificate UpdateGiftCertificateCall()
        {
            var api = new GiftCertificateApi(Constants.ApiKey);
            
            const int giftCertificateOid = 676713;
            
            var gcResponse = api.GetGiftCertificateByOid(giftCertificateOid);
            var giftCertificate = gcResponse.GiftCertificate;
            giftCertificate.Email = "perry@ultracart.com";
            

            // update does not take an expansion variable.  it will return the entire object by default.
            gcResponse = api.UpdateGiftCertificate(giftCertificateOid, giftCertificate);
            return gcResponse.GiftCertificate;
        }
    }
}