import {itemApi} from '../api';
import {ItemFunctions} from './ItemFunctions';
import {
    ItemDigitalItem,
    ItemDigitalItemResponse
} from 'ultracart_rest_api_v2_typescript';

export class UpdateDigitalItem {
    /**
     * Updates a digital item by:
     * 1. Inserting a sample digital item
     * 2. Retrieving the item
     * 3. Modifying its description and click-wrap agreement
     * 4. Updating the item
     * 5. Deleting the sample digital item
     */
    public static async execute(): Promise<void> {
        try {
            // Insert a sample digital item and get its OID
            const digitalItemOid: number = await ItemFunctions.insertSampleDigitalItem();

            // Retrieve the digital item
            const apiResponse: ItemDigitalItemResponse = await itemApi.getDigitalItem({digitalItemOid});
            const digitalItem: ItemDigitalItem | undefined = apiResponse.digital_item;

            // Ensure the digital item exists before updating
            if (!digitalItem) {
                throw new Error('Digital item not found');
            }

            // Update the digital item details
            digitalItem.description = "I have updated the description to this sentence.";
            digitalItem.click_wrap_agreement = "You hereby agree that the earth is round.  No debate.";

            // Update the digital item
            await itemApi.updateDigitalItem({digitalItemOid, digitalItem});

            // Delete the sample digital item
            await ItemFunctions.deleteSampleDigitalItem(digitalItemOid);
        } catch (error) {
            console.error("An error occurred while updating the digital item:", error);
            process.exit(1);
        }
    }
}