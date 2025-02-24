using System;
using System.IO;
using System.Text;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Client;
using com.ultracart.admin.v2.Model;

namespace SdkSample.fulfillment
{
    public class GeneratePackingSlip
    {
        /// <summary>
        /// generatePackingSlip accepts a distribution center code and order_id and returns back a base64 encoded byte array pdf.
        /// Both the dc code and order_id are needed because an order may have multiple items shipping via different DCs.
        /// 
        /// You will need the distribution center (DC) code. UltraCart allows for multiple DC and the code is a
        /// unique short string you assign to a DC as an easy mnemonic.
        /// 
        /// For more information about UltraCart distribution centers, please see:
        /// https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377114/Distribution+Center
        /// 
        /// If you do not know your DC code, query a list of all DC and print them out.
        /// $result = $fulfillment_api->getDistributionCenters();
        /// print_r($result);
        /// </summary>
        public static void Execute()
        {
            FulfillmentApi fulfillmentApi = Samples.GetFulfillmentApi();

            string distributionCenterCode = "RAMI";
            string orderId = "DEMO-12345";

            try
            {
                // limit is 500 inventory updates at a time. batch them if you're going large.
                OrderPackingSlipResponse apiResponse = fulfillmentApi.GeneratePackingSlip(distributionCenterCode, orderId);
                string base64Pdf = apiResponse.PdfBase64;
                byte[] decodedPdf = Convert.FromBase64String(base64Pdf);
                File.WriteAllBytes("packing_slip.pdf", decodedPdf);

                Console.WriteLine("done");
            }
            catch (ApiException e)
            {
                // update inventory failed. examine the reason.
                Console.WriteLine("Exception when calling FulfillmentApi->GeneratePackingSlip: " + e.Message);
                Environment.Exit(1);
            }
        }
    }
}