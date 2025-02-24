import {itemApi} from '../api.js';
import {ItemFunctions} from './itemFunctions.js';

export class GetDigitalItemsByExternalId {
    /**
     * Please Note!
     * Digital Items are not normal items you sell on your site. They are digital files that you may add to
     * a library and then attach to a normal item as an accessory or the main item itself.
     * See: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1376485/Digital+Items
     */
    static async execute() {
        try {
            // Generate a random external ID (replacing Guid.NewGuid())
            const externalId = crypto.randomUUID();
            console.log(`My external id is ${externalId}`);

            // Insert sample digital item
            const digitalItemOid = await ItemFunctions.insertSampleDigitalItem(externalId);

            // Retrieve digital items by external ID
            const apiResponse = await new Promise((resolve, reject) => {
                itemApi.getDigitalItemsByExternalId(externalId, function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data, response);
                    }
                });
            });
            const digitalItems = apiResponse.digital_items || []; // Use OR operator instead of nullish coalescing

            console.log("The following item was retrieved via GetDigitalItem():");
            console.log(digitalItems);

            // Delete the sample digital item
            await ItemFunctions.deleteSampleDigitalItem(digitalItemOid);
        } catch (error) {
            console.error("An Exception occurred. Please review the following error:");
            console.error(error);
            process.exit(1);
        }
    }
}

// Optional: If you want to execute the method
// GetDigitalItemsByExternalId.execute().catch(console.error);