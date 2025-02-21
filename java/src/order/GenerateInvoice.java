package order;

import com.ultracart.admin.v2.OrderApi;
import com.ultracart.admin.v2.models.OrderInvoiceResponse;
import com.ultracart.admin.v2.util.ApiException;

import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Base64;

public class GenerateInvoice {
   public void execute() throws IOException, ApiException {
       /*
           generateInvoice returns back a base64 encoded byte array of the given order's Invoice in PDF format.
       */

       OrderApi orderApi = new OrderApi(common.Constants.API_KEY);

       String orderId = "DEMO-0009104976";
       OrderInvoiceResponse apiResponse = orderApi.generateInvoice(orderId);

       // the invoice will return as a base64 encoded
       // unpack, save off, email, whatever.
       String base64Pdf = apiResponse.getPdfBase64();

       byte[] decodedPdf = Base64.getDecoder().decode(base64Pdf);
       try (FileOutputStream fos = new FileOutputStream("invoice.pdf")) {
           fos.write(decodedPdf);
       }

       // If this is running as a web application, you could return the PDF to the browser
       // using something like this (this is Java Servlet-specific code):
       /*
       response.setContentType("application/pdf");
       response.setHeader("Content-Disposition", "inline; filename=\"invoice.pdf\"");
       response.setHeader("Cache-Control", "public, must-revalidate, max-age=0");
       response.setHeader("Pragma", "public");
       response.setHeader("Content-Length", String.valueOf(decodedPdf.length));
       response.getOutputStream().write(decodedPdf);
       response.getOutputStream().flush();
       */

       System.out.println("Invoice PDF saved to invoice.pdf");
   }
}