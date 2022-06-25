package gift_certificate;

import com.ultracart.admin.v2.GiftCertificateApi;
import com.ultracart.admin.v2.models.GiftCertificate;
import com.ultracart.admin.v2.models.GiftCertificatesResponse;
import common.Constants;
import common.JSON;

import java.util.List;

public class GetGiftCertificatesByEmail {

  public static void main(String... args) throws Exception {

    GiftCertificateApi giftCertificateApi = new GiftCertificateApi(Constants.API_KEY, Constants.VERIFY_SSL_FLAG, Constants.DEBUG_MODE);

    String email = "support@ultracart.com";

    // by_email does not take an expansion variable.  it will return the entire object by default.
    GiftCertificatesResponse gcResponse = giftCertificateApi.getGiftCertificatesByEmail(email);
    List<GiftCertificate> giftCertificates = gcResponse.getGiftCertificates();

    for (GiftCertificate certificate : giftCertificates) {
      System.out.println(JSON.toJSON(certificate));
    }
  }
}