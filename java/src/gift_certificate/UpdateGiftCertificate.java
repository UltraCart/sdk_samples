package gift_certificate;

import com.ultracart.admin.v2.GiftCertificateApi;
import com.ultracart.admin.v2.models.GiftCertificate;
import com.ultracart.admin.v2.models.GiftCertificateResponse;
import common.Constants;
import common.JSON;

public class UpdateGiftCertificate{

  public static void main(String ... args) throws Exception {

    GiftCertificateApi giftCertificateApi = new GiftCertificateApi(Constants.API_KEY, Constants.VERIFY_SSL_FLAG, Constants.DEBUG_MODE);

    int giftCertificateOid = 676713;

    // by_oid does not take an expansion variable.  it will return the entire object by default.
    GiftCertificateResponse gcResponse = giftCertificateApi.getGiftCertificateByOid(giftCertificateOid);
    GiftCertificate giftCertificate = gcResponse.getGiftCertificate();

    giftCertificate.setEmail("support@ultracart.com");
    gcResponse = giftCertificateApi.updateGiftCertificate(giftCertificateOid, giftCertificate);
    giftCertificate = gcResponse.getGiftCertificate();

    System.out.println(JSON.toJSON(giftCertificate));

  }

}