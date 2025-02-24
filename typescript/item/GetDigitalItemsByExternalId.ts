import { itemApi } from '../api';
import {
    ItemDigitalItemsResponse,
    ItemDigitalItem
} from 'ultracart_rest_api_v2_typescript';
import { ItemFunctions } from './ItemFunctions';

export class GetDigitalItemsByExternalId {
    /**
     * Please Note!
     * Digital Items are not normal items you sell on your site. They are digital files that you may add to
     * a library and then attach to a normal item as an accessory or the main item itself.
     * See: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1376485/Digital+Items
     */
    public static async execute(): Promise<void> {
        try {
            // Generate a random external ID (replacing Guid.NewGuid())
            const externalId = crypto.randomUUID();
            console.log(`My external id is ${externalId}`);

            // Insert sample digital item
            const digitalItemOid = await ItemFunctions.insertSampleDigitalItem(externalId);

            // Retrieve digital items by external ID
            const apiResponse: ItemDigitalItemsResponse = await itemApi.getDigitalItemsByExternalId({externalId});
            const digitalItems: ItemDigitalItem[] = apiResponse.digital_items ?? []; // Use nullish coalescing

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