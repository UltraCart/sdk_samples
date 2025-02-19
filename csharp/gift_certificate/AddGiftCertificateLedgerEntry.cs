using System;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.gift_certificate
{
    // ReSharper disable once ClassNeverInstantiated.Global
    public class AddGiftCertificateLedgerEntry
    {
        public static void Execute()
        {
            var giftCertificate = AddGiftCertificateLedgerEntryCall();
            Utility.DumpObject(giftCertificate, "Gift Certificate");
        }

        // ReSharper disable once MemberCanBePrivate.Global
        public static GiftCertificate AddGiftCertificateLedgerEntryCall()
        {
            var api = new GiftCertificateApi(Constants.ApiKey);
            
            const int giftCertificateOid = 676713;
            
            GiftCertificateLedgerEntry ledgerEntry = new GiftCertificateLedgerEntry()
            {
                Amount = new Decimal(-15.35),  // this is the change amount in the gift certificate.  this is not a balance.  it will be subtracted from it.
                Description = "Customer bought something over the counter using this gift certificate.",
                EntryDts = DateTime.UtcNow.ToString("s", System.Globalization.CultureInfo.InvariantCulture),
                GiftCertificateLedgerOid = 0,  // the system will assign an oid.  do not assign one here.
                GiftCertificateOid = giftCertificateOid,  // this is an existing gift certificate oid.  I created it using createGiftCertificate.ts
                ReferenceOrderId = "BLAH-12345" // if this ledger entry is related to an order, add it here, else use null.                
            };

            // add ledger entry does not take an expansion variable.  it will return the entire object by default.
            var gcResponse = api.AddGiftCertificateLedgerEntry(giftCertificateOid, ledgerEntry);
            return gcResponse.GiftCertificate;
        }
    }
}