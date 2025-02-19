using System;
using System.IO;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.order
{
    public class GeneratePackingSlipSpecificDC
    {
        public static void Execute()
        {
            /*
             * OrderApi.generatePackingSlipSpecificDC() is a method that might be used by a fulfillment center or distribution
             * center to generate a packing slip to include with a shipment.  As such, this method allows for a packing slip
             * for a specific distribution center (DC) in the case that an order has multiple shipments from multiple DC.
             *
             * You must know the DC, which should not be a problem for any custom shipping application.
             * See: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377114/Distribution+Center
             */

            OrderApi orderApi = new OrderApi(Constants.ApiKey);

            string orderId = "DEMO-0009104390";
            string dc = "DFLT";

            OrderPackingSlipResponse apiResponse = orderApi.GeneratePackingSlipSpecificDC(dc, orderId);

            if (apiResponse.Error != null)
            {
                Console.Error.WriteLine(apiResponse.Error.DeveloperMessage);
                Console.Error.WriteLine(apiResponse.Error.UserMessage);
                Environment.Exit(1);
            }

            // the packing slip will return as a base64 encoded
            // unpack, save off, email, whatever.
            string base64PackingSlip = apiResponse.PdfBase64;


            Console.WriteLine(base64PackingSlip);
            
            // Decode Base64 string into a byte array
            byte[] pdfBytes = Convert.FromBase64String(base64PackingSlip);

            // Save the byte array to a PDF file
            File.WriteAllBytes("packing_slip.pdf", pdfBytes);

            Console.WriteLine("PDF file saved successfully as 'packing_slip.pdf'");
            

        }
    }
}