import {itemApi} from '../api';
import {ItemFunctions} from './ItemFunctions';
import {
    Item,
    ItemResponse,
    ItemPricing
} from 'ultracart_rest_api_v2_typescript';

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
    public static async execute(): Promise<void> {
        try {
            // Insert a sample item and get its merchant item ID
            const itemId: string = await ItemFunctions.insertSampleItem();

            // Define expansion parameter
            const expand: string = "pricing";

            // Retrieve the item by merchant item ID
            const apiResponse: ItemResponse = await itemApi.getItemByMerchantItemId({
                merchantItemId: itemId,
                expand,
                placeholders: false
            });
            const item: Item | undefined = apiResponse.item;

            if (item === undefined || item.merchant_item_oid === undefined) {
                console.error("Unable to retrieve item for update");
                return;
            }
            // Ensure the item exists
            if (!item || !item.pricing) {
                throw new Error('Item or pricing information not found');
            }

            // Store the original price
            const originalPrice: number = item.pricing.cost ?? 0;

            // Update the item's pricing
            const itemPricing: ItemPricing = item.pricing;
            itemPricing.cost = 12.99;

            // Update the item
            const updatedApiResponse: ItemResponse = await itemApi.updateItem({
                merchantItemOid: item.merchant_item_oid,
                item,
                expand,
                placeholders: false
            });
            const updatedItem: Item | undefined = updatedApiResponse.item;

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