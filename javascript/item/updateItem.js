import {itemApi} from '../api.js';
import {ItemFunctions} from './itemFunctions.js';

export class UpdateItem {
    /**
     * Updates an item by:
     * 1. Inserting a sample item
     * 2. Retrieving the item with pricing expansion
     * 3. Updating the item's cost
     * 4. Verifying the price update
     * 5. Deleting the sample item
     *
     * See https://www.ultracart.com/api/#resource_item.html for possible expansion values
     */
    static async execute() {
        try {
            // Insert a sample item and get its merchant item ID
            const itemId = await ItemFunctions.insertSampleItem();

            // Define expansion parameter
            const expand = "pricing";

            // Retrieve the item by merchant item ID
            const apiResponse = await new Promise((resolve, reject) => {
                itemApi.getItemByMerchantItemId(itemId,
                    {_expand: expand}, function (error, data, response) {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(data);
                        }
                    });
            });
            const item = apiResponse.item;

            if (item === undefined || item.merchant_item_oid === undefined) {
                console.error("Unable to retrieve item for update");
                return;
            }
            // Ensure the item exists
            if (!item || !item.pricing) {
                throw new Error('Item or pricing information not found');
            }

            // Store the original price
            const originalPrice = item.pricing.cost ?? 0;

            // Update the item's pricing
            const itemPricing = item.pricing;
            itemPricing.cost = 12.99;

            // Update the item
            const updatedApiResponse = await new Promise((resolve, reject) => {
                itemApi.updateItem(
                    item.merchant_item_oid,
                    item,
                    {_expand: expand}, function (error, data, response) {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(data);
                        }
                    });
            });
            const updatedItem = updatedApiResponse.item;

            // Verify the price update
            if (!updatedItem?.pricing) {
                throw new Error('Updated item or pricing information not found');
            }

            console.log(`Original Price: ${originalPrice}`);
            console.log(`Updated Price: ${updatedItem.pricing.cost}`);

            // Delete the sample item
            await ItemFunctions.deleteSampleItem(itemId);
        } catch (error) {
            console.error("An error occurred while updating the item:", error);
            process.exit(1);
        }
    }
}