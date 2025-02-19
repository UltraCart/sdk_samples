using System;
using System.Collections.Generic;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.fulfillment
{
    public class GetDistributionCenters
    {
        /*
            This method returns back a list of all distribution centers configured for a merchant.

            You will need the distribution center (DC) code for most operations.
            UltraCart allows for multiple DC and the code is a unique short string you assign to a DC as an easy mnemonic.
            This method call is an easy way to determine what a DC code is for a particular distribution center.

            For more information about UltraCart distribution centers, please see:
            https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377114/Distribution+Center
        */

        public static void Execute()
        {
            FulfillmentApi fulfillmentApi = Samples.GetFulfillmentApi();

            try
            {
                DistributionCentersResponse result = fulfillmentApi.GetDistributionCenters();
                foreach(DistributionCenter dc in result.DistributionCenters)
                Console.WriteLine(dc.ToString());

                Console.WriteLine("done");
            }
            catch (Exception e)
            {
                // update inventory failed.  examine the reason.
                Console.WriteLine("Exception when calling FulfillmentApi.GetDistributionCenters: " + e.Message);
                Environment.Exit(1);
            }
        }
    }
}