package order;

import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Base64;
import com.ultracart.admin.v2.OrderApi;
import com.ultracart.admin.v2.models.*;
import com.ultracart.admin.v2.util.ApiException;

public class GeneratePackingSlipAllDC {
   public void execute() throws IOException, ApiException {
       /*
        * OrderApi.generatePackingSlipAllDC() is a method that might be used by a fulfillment center or distribution
        * center to generate a packing slip to include with a shipment.  This method will return a packing slip for
        * an order for all distribution centers involved.
        *
        */

       OrderApi orderApi = new OrderApi(common.Constants.API_KEY);

       String orderId = "DEMO-0009104390";

       OrderPackingSlipResponse apiResponse = orderApi.generatePackingSlipAllDC(orderId);

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