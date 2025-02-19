using System;
using System.Collections.Generic;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.order
{
    public class Format
    {
        public static void Execute()
        {
            /*
             * format() returns back a text-formatted or html block for displaying an order. It is similar to what you would
             * see on a receipt page.
             */

            OrderApi orderApi = new OrderApi(Constants.ApiKey);

            OrderFormat formatOptions = new OrderFormat();
            formatOptions.Context = "receipt"; // unknown,receipt,shipment,refund,quote-request,quote
            formatOptions.Format = OrderFormat.FormatEnum.Table; // text,div,table,email
            formatOptions.ShowContactInfo = false;
            formatOptions.ShowPaymentInfo = false; // might not want to show this to just anyone.
            formatOptions.ShowMerchantNotes = false; // be careful showing these
            formatOptions.EmailAsLink = true; // makes the email addresses web links
            // if you only wish to show the items for a particular distribution center,
            // this might be useful if you have Context='shipment' and you're displaying this order to a fulfillment center, etc
            // formatOptions.FilterDistributionCenterOid = 1234321;
            formatOptions.LinkFileAttachments = true;
            formatOptions.ShowInternalInformation = true; // consider this carefully.
            formatOptions.ShowNonSensitivePaymentInfo = true; // what the customer usually sees
            formatOptions.ShowInMerchantCurrency = true;
            formatOptions.HideBillToAddress = false;
            // formatOptions.FilterToItemsInContainerOid = 123454321; // you probably won't need this.
            // when an order displays on the secure.ultracart.com site, we link the email to our order search so you can quickly
            // search for all orders for that email. I doubt you would have use for that. But maybe.
            formatOptions.DontLinkEmailToSearch = true;
            formatOptions.Translate = false; // if true, shows in customer's native language

            string orderId = "DEMO-0009104390";

            OrderFormatResponse apiResponse = orderApi.Format(orderId, formatOptions);
            
            string formattedResult = apiResponse.FormattedResult;
            Console.WriteLine("<html lang=\"en\">");
            Console.WriteLine("<head>");
            // you won't have css links for format=table
            foreach (string link in apiResponse.CssLinks)
            {
                Console.WriteLine("<style type=\"text/css\">" + link + "</style>");
            }
            Console.WriteLine("</head><body>");
            Console.WriteLine(formattedResult);
            Console.WriteLine("</body></html>");
        }
    }
}