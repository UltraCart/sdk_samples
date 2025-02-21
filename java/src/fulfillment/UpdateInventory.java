package fulfillment;

import com.ultracart.admin.v2.FulfillmentApi;
import com.ultracart.admin.v2.models.FulfillmentInventory;
import common.Constants;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class UpdateInventory {
    /*
        updateInventory is a simple means of updating UltraCart inventory for one or more items (500 max per call)
        You will need the distribution center (DC) code.  UltraCart allows for multiple DC and the code is a
        unique short string you assign to a DC as an easy mnemonic.

        For more information about UltraCart distribution centers, please see:
        https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377114/Distribution+Center

        If you do not know your DC code, query a list of all DC and print them out.
        DistributionCentersResponse result = fulfillmentApi.getDistributionCenters();
        System.out.println(result);

        Possible Errors:
        More than 500 items provided -> "inventories can not contain more than 500 records at a time"
    */

    public static void execute() {
        String distributionCenterCode = "RAMI";
        FulfillmentApi fulfillmentApi = new FulfillmentApi(Constants.API_KEY);

        String sku = "9780982021361";
        BigDecimal quantity = BigDecimal.valueOf(9);
        FulfillmentInventory firstInventory = new FulfillmentInventory();
        firstInventory.setItemId(sku);
        firstInventory.setQuantity(quantity);
        
        List<FulfillmentInventory> inventoryUpdates = new ArrayList<>();
        inventoryUpdates.add(firstInventory); // for this example, we're only updating one item.

        System.out.println(inventoryUpdates);

        try {
            // limit is 500 inventory updates at a time.  batch them if you're going large.
            fulfillmentApi.updateInventory(distributionCenterCode, inventoryUpdates);
            System.out.println("done");
        } catch (Exception e) {
            // update inventory failed.  examine the reason.
            System.out.println("Exception when calling FulfillmentApi.updateInventory: " + e.getMessage());
            System.exit(1);
        }
    }
}