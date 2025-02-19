using System;
using System.Collections.Generic;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.fulfillment
{
    public class UpdateInventory
    {
        /*
            updateInventory is a simple means of updating UltraCart inventory for one or more items (500 max per call)
            You will need the distribution center (DC) code.  UltraCart allows for multiple DC and the code is a
            unique short string you assign to a DC as an easy mnemonic.

            For more information about UltraCart distribution centers, please see:
            https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377114/Distribution+Center

            If you do not know your DC code, query a list of all DC and print them out.
            DistributionCentersResponse result = fulfillmentApi.GetDistributionCenters();
            Console.WriteLine(result);

            Possible Errors:
            More than 500 items provided -> "inventories can not contain more than 500 records at a time"
        */

        public static void Execute()
        {
            string distributionCenterCode = "RAMI";
            FulfillmentApi fulfillmentApi = Samples.GetFulfillmentApi();

            string sku = "9780982021361";
            int quantity = 9;
            FulfillmentInventory firstInventory = new FulfillmentInventory();
            firstInventory.ItemId = sku;
            firstInventory.Quantity = quantity;
            List<FulfillmentInventory> inventoryUpdates = new List<FulfillmentInventory> { firstInventory }; // for this example, we're only updating one item.

            Console.WriteLine(inventoryUpdates);

            try
            {
                // limit is 500 inventory updates at a time.  batch them if you're going large.
                fulfillmentApi.UpdateInventory(distributionCenterCode, inventoryUpdates);
                Console.WriteLine("done");
            }
            catch (Exception e)
            {
                // update inventory failed.  examine the reason.
                Console.WriteLine("Exception when calling FulfillmentApi.UpdateInventory: " + e.Message);
                Environment.Exit(1);
            }
        }
    }
}