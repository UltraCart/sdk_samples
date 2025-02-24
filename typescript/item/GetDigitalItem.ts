import { itemApi } from '../api';
import { ItemDigitalItem, ItemDigitalItemResponse } from 'ultracart_rest_api_v2_typescript';
import { ItemFunctions } from './ItemFunctions'; // Assuming ItemFunctions is in a separate file

export class GetDigitalItem {
    public static async execute(): Promise<void> {
        try {
            /*
             * Please Note!
             * Digital Items are not normal items you sell on your site. They are digital files that you may add to
             * a library and then attach to a normal item as an accessory or the main item itself.
             * See: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1376485/Digital+Items
             */

            const digitalItemOid: number = await ItemFunctions.insertSampleDigitalItem(); // create an item so I can get an item
            const apiResponse: ItemDigitalItemResponse = await itemApi.getDigitalItem({ digitalItemOid });
            const digitalItem: ItemDigitalItem|undefined = apiResponse.digital_item; // assuming this succeeded

            console.log("The following item was retrieved via GetDigitalItem():");
            console.log(digitalItem);

            await ItemFunctions.deleteSampleDigitalItem(digitalItemOid);
        } catch (e) {
            console.log("An Exception occurred. Please review the following error:");
            console.log(e); // <-- change_me: handle gracefully
            throw e; // Equivalent to Environment.Exit(1), but better for async context
        }
    }
}