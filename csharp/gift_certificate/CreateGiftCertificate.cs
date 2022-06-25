using System;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.gift_certificate
{
    // ReSharper disable once ClassNeverInstantiated.Global
    public class CreateGiftCertificate
    {

        public static void Execute()
        {
            var giftCertificate = CreateGiftCertificateCall();
            Utility.DumpObject(giftCertificate, "Gift Certificate");
        }

        // ReSharper disable once MemberCanBePrivate.Global
        public static GiftCertificate CreateGiftCertificateCall()
        {
            var api = new GiftCertificateApi(Constants.API_KEY);
            
            GiftCertificateCreateRequest createRequest = new GiftCertificateCreateRequest()
            {
                Amount = new Decimal(200.00),
                InitialLedgerDescription = "Created via C# SDK",
                MerchantNote = "Internal comment here",
                Email = "support@ultracart.com",
                ExpirationDts = DateTime.UtcNow.AddMonths(3).ToString("s", System.Globalization.CultureInfo.InvariantCulture)
            };

            // create does not take an expansion variable.  it will return the entire object by default.
            var gcResponse = api.CreateGiftCertificate(createRequest);
            return gcResponse.GiftCertificate;
        }
    }
}