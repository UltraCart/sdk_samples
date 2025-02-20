package gift_certificate;

import com.ultracart.admin.v2.GiftCertificateApi;
import com.ultracart.admin.v2.models.GiftCertificate;
import com.ultracart.admin.v2.models.GiftCertificateLedgerEntry;
import com.ultracart.admin.v2.models.GiftCertificateResponse;
import common.Constants;
import common.JSON;
import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormatter;
import org.joda.time.format.ISODateTimeFormat;

import java.math.BigDecimal;

public class AddGiftCertificateLedgerEntry{

  public static void execute() throws Exception {

    GiftCertificateApi giftCertificateApi = new GiftCertificateApi(Constants.API_KEY, Constants.VERIFY_SSL_FLAG, Constants.DEBUG_MODE);
    DateTimeFormatter fmt = ISODateTimeFormat.dateTimeNoMillis();

    int giftCertificateOid = 676713;

    GiftCertificateLedgerEntry ledgerEntry = new GiftCertificateLedgerEntry();
    ledgerEntry.setAmount(new BigDecimal("-15.55")); // this is the change amount in the gift certificate.  this is not a balance.  it will be subtracted from it.
    ledgerEntry.setDescription("Debit using Java SDK");
    ledgerEntry.setEntryDts(fmt.print(DateTime.now()));
    ledgerEntry.setGiftCertificateLedgerOid(0); // the system will assign an oid.  do not assign one here.
    ledgerEntry.setGiftCertificateOid(giftCertificateOid); // this is an existing gift certificate oid.  I created it using createGiftCertificate.ts
    ledgerEntry.setReferenceOrderId("BLAH-54321"); // if this ledger entry is related to an order, add it here, else use null.

    // add ledger does not take an expansion variable.  it will return the entire object by default.
    GiftCertificateResponse gcResponse = giftCertificateApi.addGiftCertificateLedgerEntry(giftCertificateOid, ledgerEntry);
    GiftCertificate giftCertificate = gcResponse.getGiftCertificate();

    System.out.println(JSON.toJSON(giftCertificate));

  }

}