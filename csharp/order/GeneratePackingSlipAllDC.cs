using System;
using System.IO;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.order
{
    public class GeneratePackingSlipAllDC
    {
        public static void Execute()
        {
            /*
             * OrderApi.generatePackingSlipAllDC() is a method that might be used by a fulfillment center or distribution
             * center to generate a packing slip to include with a shipment.  This method will return a packing slip for
             * an order for all distribution centers involved.
             *
             */

            OrderApi orderApi = new OrderApi(Constants.ApiKey);

            string orderId = "DEMO-0009104390";

            OrderPackingSlipResponse apiResponse = orderApi.GeneratePackingSlipAllDC(orderId);

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