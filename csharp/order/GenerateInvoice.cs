using System;
using System.IO;
using System.Net;
using System.Text;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.order
{
    public class GenerateInvoice
    {
        public static void Execute()
        {
            /*
                generateInvoice returns back a base64 encoded byte array of the given order's Invoice in PDF format.
            */

            OrderApi orderApi = new OrderApi(Constants.ApiKey);

            string orderId = "DEMO-0009104976";
            OrderInvoiceResponse apiResponse = orderApi.GenerateInvoice(orderId);

            // the invoice will return as a base64 encoded
            // unpack, save off, email, whatever.
            string base64Pdf = apiResponse.PdfBase64;

            byte[] decodedPdf = Convert.FromBase64String(base64Pdf);
            File.WriteAllBytes("invoice.pdf", decodedPdf);

            // If this is running as a web application, you could return the PDF to the browser
            // using something like this (this is ASP.NET-specific code):
            /*
            HttpContext.Current.Response.ContentType = "application/pdf";
            HttpContext.Current.Response.AddHeader("Content-Disposition", "inline; filename=\"invoice.pdf\"");
            HttpContext.Current.Response.AddHeader("Cache-Control", "public, must-revalidate, max-age=0");
            HttpContext.Current.Response.AddHeader("Pragma", "public");
            HttpContext.Current.Response.AddHeader("Content-Length", decodedPdf.Length.ToString());
            HttpContext.Current.Response.BinaryWrite(decodedPdf);
            HttpContext.Current.Response.End();
            */

            Console.WriteLine("Invoice PDF saved to invoice.pdf");
        }
    }
}