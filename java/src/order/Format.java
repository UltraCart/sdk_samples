package order;

import com.ultracart.admin.v2.OrderApi;
import com.ultracart.admin.v2.models.*;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

public class Format {
   public static void execute() throws ApiException {
       /*
        * format() returns back a text-formatted or html block for displaying an order. It is similar to what you would
        * see on a receipt page.
        */

       OrderApi orderApi = new OrderApi(Constants.API_KEY);

       OrderFormat formatOptions = new OrderFormat();
       formatOptions.setContext("receipt"); // unknown,receipt,shipment,refund,quote-request,quote
       formatOptions.setFormat(OrderFormat.FormatEnum.TABLE); // text,div,table,email
       formatOptions.setShowContactInfo(false);
       formatOptions.setShowPaymentInfo(false); // might not want to show this to just anyone.
       formatOptions.setShowMerchantNotes(false); // be careful showing these
       formatOptions.setEmailAsLink(true); // makes the email addresses web links
       // if you only wish to show the items for a particular distribution center,
       // this might be useful if you have Context='shipment' and you're displaying this order to a fulfillment center, etc
       // formatOptions.setFilterDistributionCenterOid(1234321);
       formatOptions.setLinkFileAttachments(true);
       formatOptions.setShowInternalInformation(true); // consider this carefully.
       formatOptions.setShowNonSensitivePaymentInfo(true); // what the customer usually sees
       formatOptions.setShowInMerchantCurrency(true);
       formatOptions.setHideBillToAddress(false);
       // formatOptions.setFilterToItemsInContainerOid(123454321); // you probably won't need this.
       // when an order displays on the secure.ultracart.com site, we link the email to our order search so you can quickly
       // search for all orders for that email. I doubt you would have use for that. But maybe.
       formatOptions.setDontLinkEmailToSearch(true);
       formatOptions.setTranslate(false); // if true, shows in customer's native language

       String orderId = "DEMO-0009104390";

       OrderFormatResponse apiResponse = orderApi.format(orderId, formatOptions);
       
       String formattedResult = apiResponse.getFormattedResult();
       System.out.println("<html lang=\"en\">");
       System.out.println("<head>");
       // you won't have css links for format=table
       for (String link : apiResponse.getCssLinks()) {
           System.out.println("<style type=\"text/css\">" + link + "</style>");
       }
       System.out.println("</head><body>");
       System.out.println(formattedResult);
       System.out.println("</body></html>");
   }
}