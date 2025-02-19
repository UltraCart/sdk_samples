using System.Collections.Generic;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.gift_certificate
{
    // ReSharper disable once ClassNeverInstantiated.Global
    public class GetGiftCertificatesByQuery
    {

        public static void Execute()
        {
            var giftCertificates = GetGiftCertificateByQueryCall();
            foreach (var giftCertificate in giftCertificates)
            {
                Utility.DumpObject(giftCertificate, "Gift Certificate");    
            }
        }


        private static List<GiftCertificate> GetGiftCertificateChunk(GiftCertificateApi api, int offset, int limit)
        {
            const string expansion = "ledger";

            // leaving query empty, so no filtering, and I should get all records returned.
            GiftCertificateQuery query = new GiftCertificateQuery();
            
            var gcResponse = api.GetGiftCertificatesByQuery(query, limit, offset, null, null, expansion);
                if(gcResponse.Success == true && gcResponse.GiftCertificates != null){
                    return gcResponse.GiftCertificates;
                }

                return new List<GiftCertificate>();
        }
        
        
        
        // ReSharper disable once MemberCanBePrivate.Global
        public static List<GiftCertificate> GetGiftCertificateByQueryCall()
        {
            var api = new GiftCertificateApi(Constants.ApiKey);

            List<GiftCertificate> giftCertificates = new List<GiftCertificate>();

            var iteration = 1;
            var offset = 0;
            var limit = 200;
            var moreRecordsToFetch = true;

            while( moreRecordsToFetch ){

                System.Console.WriteLine("executing iteration " + iteration);
                var chuckOfCertificates = GetGiftCertificateChunk(api, offset, limit);
                giftCertificates.AddRange(chuckOfCertificates);
                offset += limit;
                moreRecordsToFetch = chuckOfCertificates.Count == limit;
                iteration++;
                
            }
            

            return giftCertificates;
        }
    }
}