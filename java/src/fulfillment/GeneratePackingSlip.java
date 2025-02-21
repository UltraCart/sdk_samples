package fulfillment;

import java.util.Base64;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.io.IOException;

import com.ultracart.admin.v2.FulfillmentApi;
import com.ultracart.admin.v2.models.OrderPackingSlipResponse;
import com.ultracart.admin.v2.util.ApiException;

import common.Constants;

public class GeneratePackingSlip {
    /**
     * generatePackingSlip accepts a distribution center code and order_id and returns back a base64 encoded byte array pdf.
     * Both the dc code and order_id are needed because an order may have multiple items shipping via different DCs.
     *
     * You will need the distribution center (DC) code. UltraCart allows for multiple DC and the code is a
     * unique short string you assign to a DC as an easy mnemonic.
     *
     * For more information about UltraCart distribution centers, please see:
     * https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377114/Distribution+Center
     *
     * If you do not know your DC code, query a list of all DC and print them out.
     * $result = $fulfillment_api->getDistributionCenters();
     * print_r($result);
     */
    public static void execute() {
        FulfillmentApi fulfillmentApi = new FulfillmentApi(Constants.API_KEY);

        String distributionCenterCode = "RAMI";
        String orderId = "DEMO-12345";

        try {
            // limit is 500 inventory updates at a time. batch them if you're going large.
            OrderPackingSlipResponse apiResponse = fulfillmentApi.generatePackingSlip(distributionCenterCode, orderId);
            String base64Pdf = apiResponse.getPdfBase64();
            byte[] decodedPdf = Base64.getDecoder().decode(base64Pdf);
            Files.write(Paths.get("packing_slip.pdf"), decodedPdf);

            System.out.println("done");
        } catch (ApiException | IOException e) {
            // update inventory failed. examine the reason.
            System.out.println("Exception when calling FulfillmentApi->generatePackingSlip: " + e.getMessage());
            System.exit(1);
        }
    }
}