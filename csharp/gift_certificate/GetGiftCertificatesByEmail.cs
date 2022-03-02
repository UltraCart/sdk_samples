using System.Collections.Generic;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.gift_certificate
{
    // ReSharper disable once ClassNeverInstantiated.Global
    public class GetGiftCertificatesByEmail
    {
        // uncomment to run.  C# projects can only have one main.
        // public static void Main()
        // {
        //     var giftCertificates = GetGiftCertificatesByEmailCall();
        //     Utility.DumpObject(giftCertificates, "Gift Certificates");
        //     foreach (var gc in giftCertificates)
        //     {
        //         Utility.DumpObject(gc, "Gift Certificate");
        //     }
        //     
        // }

        // ReSharper disable once MemberCanBePrivate.Global
        public static List<GiftCertificate> GetGiftCertificatesByEmailCall()
        {
            var api = new GiftCertificateApi(Constants.API_KEY);
            
            const string email = "support@ultracart.com";

            // by_email does not take an expansion variable.  it will return the entire object by default.
            var gcResponse = api.GetGiftCertificatesByEmail(email);
            return gcResponse.GiftCertificates;
        }
    }
}