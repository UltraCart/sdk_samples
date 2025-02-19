using System;
using System.Collections.Generic;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.fulfillment
{
    public class ShipOrders
    {
        /*
            shipOrders informs UltraCart that you (the fulfillment center) have shipped an order and allows you to provide
            UltraCart with tracking information.

            You will need the distribution center (DC) code.  UltraCart allows for multiple DC and the code is a
            unique short string you assign to a DC as an easy mnemonic.

            For more information about UltraCart distribution centers, please see:
            https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377114/Distribution+Center

            If you do not know your DC code, query a list of all DC and print them out.
            DistributionCentersResponse result = fulfillmentApi.GetDistributionCenters();
            Console.WriteLine(result);

            A successful call will receive back a status code 204 (No Content).

            Possible Errors:
            More than 100 order ids provided -> "shipments can not contain more than 100 records at a time"
        */

        public static void Execute()
        {
            string distributionCenterCode = "RAMI";
            FulfillmentApi fulfillmentApi = Samples.GetFulfillmentApi();

            FulfillmentShipment shipment = new FulfillmentShipment();
            shipment.OrderId = "DEMO-12345";
            shipment.TrackingNumbers = new List<string> { "UPS-1234567890", "USPS-BLAH-BLAH-BLAH" }; // this order had two boxes.
            shipment.ShippingCost = 16.99m; // the actual cost to ship this order
            shipment.FulfillmentFee = 8.99m; // this fulfillment center is kinda pricey.
            shipment.PackageCost = 11.99m; // 11.99?  we use only the finest packaging.

            List<FulfillmentShipment> shipments = new List<FulfillmentShipment> { shipment }; // up to 100 shipments per call

            try
            {
                // limit is 100 shipments updates at a time.
                fulfillmentApi.ShipOrders(distributionCenterCode, shipments);
                Console.WriteLine("done");
            }
            catch (Exception e)
            {
                // update inventory failed.  examine the reason.
                Console.WriteLine("Exception when calling FulfillmentApi.ShipOrders: " + e.Message);
                Environment.Exit(1);
            }
        }
    }
}