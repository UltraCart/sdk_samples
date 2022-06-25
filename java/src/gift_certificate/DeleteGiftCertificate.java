package gift_certificate;

import com.ultracart.admin.v2.GiftCertificateApi;
import com.ultracart.admin.v2.models.GiftCertificate;
import com.ultracart.admin.v2.models.GiftCertificateResponse;
import common.Constants;
import common.JSON;

public class DeleteGiftCertificate{

  public static void main(String ... args) throws Exception {

    GiftCertificateApi giftCertificateApi = new GiftCertificateApi(Constants.API_KEY, Constants.VERIFY_SSL_FLAG, Constants.DEBUG_MODE);

    int giftCertificateOid = 676713;

    giftCertificateApi.deleteGiftCertificate(giftCertificateOid);

    // if I query the gift certificate again, I will get an object back, but the deleted property will be true.
    // by_oid does not take an expansion variable.  it will return the entire object by default.
    GiftCertificateResponse gcResponse = giftCertificateApi.getGiftCertificateByOid(giftCertificateOid);
    GiftCertificate giftCertificate = gcResponse.getGiftCertificate();

    System.out.println(JSON.toJSON(giftCertificate));

  }

}