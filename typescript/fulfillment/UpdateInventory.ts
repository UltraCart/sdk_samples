import {
    FulfillmentInventory
} from 'ultracart_rest_api_v2_typescript';
import { fulfillmentApi } from '../api';

export class UpdateInventory {
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
    public static async Execute(): Promise<void> {
        const distributionCenterCode: string = "RAMI";

        const sku: string = "9780982021361";
        const quantity: number = 9;

        // Create inventory update
        const firstInventory: FulfillmentInventory = {
            itemId: sku,
            quantity: quantity
        };

        // For this example, we're only updating one item
        const inventoryUpdates: FulfillmentInventory[] = [firstInventory];

        console.log(JSON.stringify(inventoryUpdates, null, 2));

        try {
            // limit is 500 inventory updates at a time. batch them if you're going large.
            await fulfillmentApi.updateInventory({
                distributionCenterCode: distributionCenterCode,
                inventories: inventoryUpdates
            });
            console.log("done");
        }
        catch (e) {
            // update inventory failed. examine the reason.
            console.error(`Exception when calling FulfillmentApi.UpdateInventory: ${e instanceof Error ? e.message : e}`);
            process.exit(1);
        }
    }
}