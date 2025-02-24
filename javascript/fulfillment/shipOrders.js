import { fulfillmentApi } from '../api.js';

export class ShipOrders {
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
    static async Execute() {
        const distributionCenterCode = "RAMI";

        // Create shipment
        const shipment = {
            order_id: "DEMO-12345",
            tracking_numbers: ["UPS-1234567890", "USPS-BLAH-BLAH-BLAH"], // this order had two boxes.
            shipping_cost: 16.99, // the actual cost to ship this order
            fulfillment_fee: 8.99, // this fulfillment center is kinda pricey.
            package_cost: 11.99 // 11.99?  we use only the finest packaging.
        };

        const shipments = [shipment]; // up to 100 shipments per call

        try {
            // limit is 100 shipments updates at a time.
            await new Promise((resolve, reject) => {
                fulfillmentApi.shipOrders(distributionCenterCode, shipments, function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data, response);
                    }
                });
            });

            console.log("done");
        }
        catch (e) {
            // update inventory failed. examine the reason.
            console.error(`Exception when calling FulfillmentApi.ShipOrders: ${e instanceof Error ? e.message : e}`);
            process.exit(1);
        }
    }
}