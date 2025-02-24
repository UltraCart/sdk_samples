import {itemApi} from '../api.js';
import {ItemFunctions} from './itemFunctions.js';

export class UpdateDigitalItem {
    /**
     * Updates a digital item by:
     * 1. Inserting a sample digital item
     * 2. Retrieving the item
     * 3. Modifying its description and click-wrap agreement
     * 4. Updating the item
     * 5. Deleting the sample digital item
     */
    static async execute() {
        try {
            // Insert a sample digital item and get its OID
            const digitalItemOid = await ItemFunctions.insertSampleDigitalItem();

            // Retrieve the digital item
            const apiResponse = await new Promise((resolve, reject) => {
                itemApi.getDigitalItem(digitalItemOid, function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const digitalItem = apiResponse.digital_item;

            // Ensure the digital item exists before updating
            if (!digitalItem) {
                throw new Error('Digital item not found');
            }

            // Update the digital item details
            digitalItem.description = "I have updated the description to this sentence.";
            digitalItem.click_wrap_agreement = "You hereby agree that the earth is round.  No debate.";

            // Update the digital item
            await new Promise((resolve, reject) => {
                itemApi.updateDigitalItem(digitalItemOid, digitalItem, function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            // Delete the sample digital item
            await ItemFunctions.deleteSampleDigitalItem(digitalItemOid);
        } catch (error) {
            console.error("An error occurred while updating the digital item:", error);
            process.exit(1);
        }
    }
}