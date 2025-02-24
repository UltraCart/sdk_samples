import {itemApi} from '../api.js';
import {ItemFunctions} from './itemFunctions.js';

export class UpdateItems {
    /**
     * Updates multiple items by:
     * 1. Inserting two sample items
     * 2. Retrieving both items with pricing expansion
     * 3. Updating the prices of both items
     * 4. Performing a bulk update
     * 5. Deleting the sample items
     *
     * See https://www.ultracart.com/api/#resource_item.html for possible expansion values
     */
    static async execute() {
        try {
            // Insert two sample items
            const itemId1 = await ItemFunctions.insertSampleItem();
            const itemId2 = await ItemFunctions.insertSampleItem();

            // Define expansion parameter
            const expand = "pricing";

            // Retrieve the first item
            const apiResponse1 = await new Promise((resolve, reject) => {
                itemApi.getItemByMerchantItemId(itemId1,
                    {_expand: expand}, function (error, data, response) {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(data);
                        }
                    });
            });
            const item1 = apiResponse1.item;

            // Retrieve the second item
            const apiResponse2 = await new Promise((resolve, reject) => {
                itemApi.getItemByMerchantItemId(
                    itemId2,
                    {_expand: expand}, function (error, data, response) {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(data);
                        }
                    });
            });
            const item2 = apiResponse2.item;

            // Ensure both items exist and have pricing
            if (!item1 || !item1.pricing || !item2 || !item2.pricing) {
                throw new Error('One or more items or their pricing information not found');
            }

            // Update the prices of the items
            item1.pricing.cost = 12.99;
            item2.pricing.cost = 14.99;

            // Prepare items for bulk update
            const updateItemsRequest = {
                items: [item1, item2]
            };

            // Perform bulk update
            const updateItemsResponse = await new Promise((resolve, reject) => {
                itemApi.updateItems(updateItemsRequest,
                    {_expand: expand, async: false}, function (error, data, response) {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(data);
                        }
                    });
            });

            // Delete the sample items
            await ItemFunctions.deleteSampleItem(itemId1);
            await ItemFunctions.deleteSampleItem(itemId2);
        } catch (error) {
            console.error("An error occurred while updating items:", error);
            process.exit(1);
        }
    }
}