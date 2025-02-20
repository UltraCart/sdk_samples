package gift_certificate;

import com.ultracart.admin.v2.GiftCertificateApi;
import com.ultracart.admin.v2.models.GiftCertificate;
import com.ultracart.admin.v2.models.GiftCertificateResponse;
import common.Constants;
import common.JSON;

public class GetGiftCertificateByCode{

  public static void execute() throws Exception {

    GiftCertificateApi giftCertificateApi = new GiftCertificateApi(Constants.API_KEY, Constants.VERIFY_SSL_FLAG, Constants.DEBUG_MODE);

    String code = "93KHHXD6VH";

    // by_code does not take an expansion variable.  it will return the entire object by default.
    GiftCertificateResponse gcResponse = giftCertificateApi.getGiftCertificateByCode(code);
    GiftCertificate giftCertificate = gcResponse.getGiftCertificate();

    System.out.println(JSON.toJSON(giftCertificate));

  }

}