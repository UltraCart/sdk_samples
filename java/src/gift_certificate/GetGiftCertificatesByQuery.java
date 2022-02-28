package gift_certificate;

import com.ultracart.admin.v2.GiftCertificateApi;
import com.ultracart.admin.v2.models.GiftCertificate;
import com.ultracart.admin.v2.models.GiftCertificateQuery;
import com.ultracart.admin.v2.models.GiftCertificatesResponse;
import com.ultracart.admin.v2.swagger.ApiException;
import common.Constants;
import common.JSON;

import java.util.ArrayList;
import java.util.List;

public class GetGiftCertificatesByQuery{

  public static List<GiftCertificate> getGiftCertificateChunk(GiftCertificateApi giftCertificateApi,
                                                                   int offset,
                                                                   int limit) throws ApiException {
    String expansion = "ledger";
    GiftCertificateQuery query = new GiftCertificateQuery();  // leave this empty to retrieve all records.
    GiftCertificatesResponse gcResponse = giftCertificateApi.getGiftCertificatesByQuery(query, limit, offset, null, null, expansion);
    if(gcResponse != null && gcResponse.getGiftCertificates() != null){
      return gcResponse.getGiftCertificates();
    }
    return new ArrayList<>();
  }

  public static void main(String ... args) throws Exception {

    GiftCertificateApi giftCertificateApi = new GiftCertificateApi(Constants.API_KEY);

    ArrayList<GiftCertificate> giftCertificates = new ArrayList<>();
    int iteration = 1;
    int offset = 0;
    int limit = 200;
    boolean moreRecordsToFetch = true;

    while( moreRecordsToFetch ){

        System.out.println("executing iteration " + iteration);
        List<GiftCertificate> chuckOfCertificates = getGiftCertificateChunk(giftCertificateApi, offset, limit);
        giftCertificates.addAll(chuckOfCertificates);
        offset = offset + limit;
        moreRecordsToFetch = chuckOfCertificates.size() == limit;
        iteration++;

    }

    for (GiftCertificate giftCertificate : giftCertificates) {
      System.out.println(JSON.toJSON(giftCertificate));
    }
  }
}