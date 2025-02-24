import {itemApi} from '../api';
import {ItemFunctions} from './ItemFunctions';
import {
    Item,
    ItemResponse,
    ItemsRequest,
    ItemsResponse
} from 'ultracart_rest_api_v2_typescript';

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
    public static async execute(): Promise<void> {
        try {
            // Insert two sample items
            const itemId1: string = await ItemFunctions.insertSampleItem();
            const itemId2: string = await ItemFunctions.insertSampleItem();

            // Define expansion parameter
            const expand: string = "pricing";

            // Retrieve the first item
            const apiResponse1: ItemResponse = await itemApi.getItemByMerchantItemId({
                merchantItemId: itemId1,
                expand,
                placeholders: false
            });
            const item1: Item | undefined = apiResponse1.item;

            // Retrieve the second item
            const apiResponse2: ItemResponse = await itemApi.getItemByMerchantItemId({
                merchantItemId: itemId2,
                expand,
                placeholders: false
            });
            const item2: Item | undefined = apiResponse2.item;

            // Ensure both items exist and have pricing
            if (!item1 || !item1.pricing || !item2 || !item2.pricing) {
                throw new Error('One or more items or their pricing information not found');
            }

            // Update the prices of the items
            item1.pricing.cost = 12.99;
            item2.pricing.cost = 14.99;

            // Prepare items for bulk update
            const updateItemsRequest: ItemsRequest = {
                items: [item1, item2]
            };

            // Perform bulk update
            const updateItemsResponse: ItemsResponse = await itemApi.updateItems({
                itemsRequest: updateItemsRequest,
                expand,
                placeholders: false,
                async: false
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