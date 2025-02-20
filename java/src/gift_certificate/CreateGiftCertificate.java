package gift_certificate;

import com.ultracart.admin.v2.GiftCertificateApi;
import com.ultracart.admin.v2.models.GiftCertificate;
import com.ultracart.admin.v2.models.GiftCertificateCreateRequest;
import com.ultracart.admin.v2.models.GiftCertificateResponse;
import common.Constants;
import common.JSON;
import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormatter;
import org.joda.time.format.ISODateTimeFormat;

import java.math.BigDecimal;

public class CreateGiftCertificate {

  public static void execute() throws Exception {

    // Don't use verifySsl=false in production.
    GiftCertificateApi giftCertificateApi = new GiftCertificateApi(Constants.API_KEY, Constants.VERIFY_SSL_FLAG, Constants.DEBUG_MODE);
    DateTimeFormatter fmt = ISODateTimeFormat.dateTimeNoMillis();

    GiftCertificateCreateRequest createRequest = new GiftCertificateCreateRequest();
    createRequest.setAmount(new BigDecimal("150.75"));
    createRequest.setInitialLedgerDescription("Issued instead of refund");
    createRequest.setMerchantNote("Created via Java SDK");
    createRequest.setEmail("perry@ultracart.com");
    createRequest.setExpirationDts(fmt.print(DateTime.now().plusMonths(3)));

    // create does not take an expansion variable.  it will return the entire object by default.
    GiftCertificateResponse gcResponse = giftCertificateApi.createGiftCertificate(createRequest);
    GiftCertificate giftCertificate = gcResponse.getGiftCertificate();

    System.out.println(JSON.toJSON(giftCertificate));

  }

}