package order;

import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Base64;
import com.ultracart.admin.v2.OrderApi;
import com.ultracart.admin.v2.models.*;
import com.ultracart.admin.v2.util.ApiException;

public class GeneratePackingSlipSpecificDC {
   public void execute() throws IOException, ApiException {
       /*
        * OrderApi.generatePackingSlipSpecificDC() is a method that might be used by a fulfillment center or distribution
        * center to generate a packing slip to include with a shipment.  As such, this method allows for a packing slip
        * for a specific distribution center (DC) in the case that an order has multiple shipments from multiple DC.
        *
        * You must know the DC, which should not be a problem for any custom shipping application.
        * See: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377114/Distribution+Center
        */

       OrderApi orderApi = new OrderApi(common.Constants.API_KEY);

       String orderId = "DEMO-0009104390";
       String dc = "DFLT";

       OrderPackingSlipResponse apiResponse = orderApi.generatePackingSlipSpecificDC(dc, orderId);

       if (apiResponse.getError() != null) {
           System.err.println(apiResponse.getError().getDeveloperMessage());
           System.err.println(apiResponse.getError().getUserMessage());
           System.exit(1);
       }

       // the packing slip will return as a base64 encoded
       // unpack, save off, email, whatever.
       String base64PackingSlip = apiResponse.getPdfBase64();

       System.out.println(base64PackingSlip);

       // Decode Base64 string into a byte array
       byte[] pdfBytes = Base64.getDecoder().decode(base64PackingSlip);

       // Save the byte array to a PDF file
       try (FileOutputStream fos = new FileOutputStream("packing_slip.pdf")) {
           fos.write(pdfBytes);
       }

       System.out.println("PDF file saved successfully as 'packing_slip.pdf'");
   }
}